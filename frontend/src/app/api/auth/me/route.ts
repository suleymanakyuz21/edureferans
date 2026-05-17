import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        isActive: true,
        role: true,
        refCode: true,
        balance: true,
        avatar: true,
        phone: true,
        profession: true,
        city: true,
        about: true,
        createdAt: true,
        _count: { select: { referrals: true } },
      },
    });

    if (!user) return unauthorizedResponse('Kullanıcı bulunamadı.');
    if (!user.isActive) return unauthorizedResponse('Hesabınız askıya alınmıştır.');

    return successResponse({ ...user, balance: Number(user.balance) });
  } catch (error) {
    console.error('Me error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
