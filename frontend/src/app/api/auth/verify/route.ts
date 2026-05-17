import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, COOKIE_OPTIONS } from '@/lib/auth';
import { errorResponse } from '@/lib/apiResponse';

// Simple in-memory rate limiter: 10 attempts per 15 minutes per IP
const verifyAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = verifyAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    verifyAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (isRateLimited(ip)) {
    return errorResponse('Çok fazla doğrulama denemesi. 15 dakika sonra tekrar deneyin.', 429);
  }

  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return errorResponse('E-posta ve doğrulama kodu zorunludur.');
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) return errorResponse('Kullanıcı bulunamadı.', 404);
    if (user.isVerified) return errorResponse('Hesap zaten doğrulanmış.');

    // Check OTP expiry
    if (user.verificationCodeExpiresAt && new Date() > user.verificationCodeExpiresAt) {
      return errorResponse('Doğrulama kodunun süresi dolmuş. Lütfen tekrar kayıt olun.', 400);
    }

    if (user.verificationCode !== code) {
      return errorResponse('Geçersiz doğrulama kodu.');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationCode: null, verificationCodeExpiresAt: null },
    });

    // Notify referrer
    if (updatedUser.referredById) {
      await prisma.notification.create({
        data: {
          userId: updatedUser.referredById,
          type: 'referral',
          title: 'Yeni Referans! 👤',
          message: `${updatedUser.name} referans linkin ile aramıza katıldı.`,
        },
      }).catch((e) => console.error('Notification error:', e));
    }

    const token = signToken({ id: updatedUser.id });

    // Reset rate limit on success
    verifyAttempts.delete(ip);

    const response = NextResponse.json({
      success: true,
      message: 'Hesabınız başarıyla doğrulandı!',
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isPremium: updatedUser.isPremium,
          refCode: updatedUser.refCode,
          balance: Number(updatedUser.balance),
          role: updatedUser.role,
        },
      },
    });

    response.cookies.set('token', token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Verify error:', msg);
    return errorResponse(`Sunucu hatası: ${msg}`, 500);
  }
}
