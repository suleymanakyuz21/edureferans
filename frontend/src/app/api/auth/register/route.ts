import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

function generateRefCode(name: string): string {
  return name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, referralCode } = await request.json();

    if (!name || !email || !password) {
      return errorResponse('Ad, e-posta ve şifre zorunludur.', 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse('Bu e-posta adresi zaten kullanılıyor.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique refCode
    let refCode = generateRefCode(name);
    let codeExists = await prisma.user.findUnique({ where: { refCode } });
    while (codeExists) {
      refCode = generateRefCode(name);
      codeExists = await prisma.user.findUnique({ where: { refCode } });
    }

    let referredById: number | null = null;
    let grandReferredById: number | null = null;

    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { refCode: referralCode } });
      if (referrer) {
        referredById = referrer.id;
        grandReferredById = referrer.referredById;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        refCode,
        referredById,
        grandReferredById,
        isVerified: false,
        verificationCode: otp,
      },
    });

    console.log(`\n========================================`);
    console.log(`MOCK EMAIL TO: ${email}`);
    console.log(`VERIFICATION CODE: ${otp}`);
    console.log(`========================================\n`);

    return successResponse(
      { requiresVerification: true, email: newUser.email, mockCode: otp },
      'Doğrulama kodu e-postanıza gönderildi.',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Sunucu hatası. Lütfen tekrar deneyin.', 500);
  }
}
