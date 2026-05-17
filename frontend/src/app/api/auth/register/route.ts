import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { sendVerificationEmail } from '@/lib/email';

// Simple in-memory rate limiter: 3 registrations per hour per IP
const registerAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = registerAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    registerAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 3) return true;
  entry.count++;
  return false;
}

const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(8).max(128),
  referralCode: z.string().max(20).optional(),
});

function generateRefCode(name: string): string {
  return name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (isRateLimited(ip)) {
    return errorResponse('Çok fazla kayıt denemesi. Bir süre sonra tekrar deneyin.', 429);
  }

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return errorResponse(firstError.message, 400);
    }

    const { name, email, password, referralCode } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    // If account exists but not verified yet — resend a fresh OTP instead of erroring
    if (existingUser) {
      if (existingUser.isVerified) {
        return errorResponse('Bu e-posta adresi zaten kullanılıyor.', 400);
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await prisma.user.update({
        where: { email },
        data: { verificationCode: otp, verificationCodeExpiresAt: otpExpiresAt },
      });

      let emailFailed = false;
      try {
        await sendVerificationEmail(email, otp);
      } catch (emailError) {
        console.error('[REGISTER] Email resend failed:', emailError);
        emailFailed = true;
      }

      return successResponse(
        {
          requiresVerification: true,
          email,
          ...(emailFailed && { debugCode: otp }),
        },
        emailFailed
          ? 'E-posta gönderilemedi. Kod aşağıda gösterildi.'
          : 'Yeni doğrulama kodu e-postanıza gönderildi.',
        200
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique refCode
    let refCode = generateRefCode(name);
    while (await prisma.user.findUnique({ where: { refCode } })) {
      refCode = generateRefCode(name);
    }

    let referredById: number | null = null;
    let grandReferredById: number | null = null;

    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { refCode: referralCode } });
      if (referrer && referrer.isActive && referrer.isVerified) {
        referredById = referrer.id;
        grandReferredById = referrer.referredById;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        refCode,
        referredById,
        grandReferredById,
        isVerified: false,
        verificationCode: otp,
        verificationCodeExpiresAt: otpExpiresAt,
      },
    });

    let emailFailed = false;
    try {
      await sendVerificationEmail(email, otp);
    } catch (emailError) {
      console.error('[REGISTER] Email send failed:', emailError);
      emailFailed = true;
    }

    return successResponse(
      {
        requiresVerification: true,
        email,
        // Temporary: show OTP in response when email delivery fails
        ...(emailFailed && { debugCode: otp }),
      },
      emailFailed
        ? 'E-posta gönderilemedi. Kod aşağıda gösterildi.'
        : 'Doğrulama kodu e-postanıza gönderildi.',
      201
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Register error:', msg);
    return errorResponse(`Sunucu hatası: ${msg}`, 500);
  }
}
