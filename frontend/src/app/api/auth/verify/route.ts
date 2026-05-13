import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return errorResponse('E-posta ve doğrulama kodu zorunludur.');
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return errorResponse('Kullanıcı bulunamadı.', 404);
    }
    if (user.isVerified) {
      return errorResponse('Hesap zaten doğrulanmış.');
    }
    if (user.verificationCode !== code) {
      return errorResponse('Geçersiz doğrulama kodu.');
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationCode: null },
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

    return successResponse(
      {
        token,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          isPremium: updatedUser.isPremium,
          refCode: updatedUser.refCode,
          balance: updatedUser.balance,
        },
      },
      'Hesabınız başarıyla doğrulandı!'
    );
  } catch (error) {
    console.error('Verify error:', error);
    return errorResponse('Sunucu hatası. Lütfen tekrar deneyin.', 500);
  }
}
