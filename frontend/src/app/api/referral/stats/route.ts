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
        balance: true,
        referrals: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            isPremium: true,
          },
        },
        commissionsEarned: {
          select: {
            id: true,
            amount: true,
            level: true,
            createdAt: true,
            fromUser: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: { referrals: true },
        },
      },
    });

    if (!user) return unauthorizedResponse();

    const level1Count = user.referrals.length;
    const level2Count = await prisma.user.count({
      where: { grandReferredById: auth.id },
    });

    return successResponse({
      balance: user.balance,
      referralCount: level1Count,
      level2Count,
      referrals: user.referrals,
      commissions: user.commissionsEarned,
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
