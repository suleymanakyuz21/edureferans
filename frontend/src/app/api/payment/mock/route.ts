import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/apiResponse';

const PREMIUM_PRICE = 10000; // ₺10,000
const LEVEL1_RATE = 0.25;    // 25%
const LEVEL2_RATE = 0.10;    // 10%

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const user = await prisma.user.findUnique({ where: { id: auth.id } });
    if (!user) return unauthorizedResponse();
    if (user.isPremium) {
      return errorResponse('Zaten Premium üyesiniz.', 400);
    }

    // Atomic transaction — payment + premium upgrade + referral commissions
    await prisma.$transaction(async (tx) => {
      // 1. Create payment record
      await tx.payment.create({
        data: { userId: user.id, amount: PREMIUM_PRICE, status: 'COMPLETED' },
      });

      // 2. Upgrade to premium
      await tx.user.update({
        where: { id: user.id },
        data: { isPremium: true },
      });

      // 3. Level 1 commission
      if (user.referredById) {
        const lvl1Amount = PREMIUM_PRICE * LEVEL1_RATE;
        await tx.user.update({
          where: { id: user.referredById },
          data: { balance: { increment: lvl1Amount } },
        });
        await tx.commission.create({
          data: { fromUserId: user.id, toUserId: user.referredById, level: 1, amount: lvl1Amount },
        });
        await tx.notification.create({
          data: {
            userId: user.referredById,
            type: 'commission',
            title: 'Yeni Komisyon! 💰',
            message: `${user.name} üzerinden ₺${lvl1Amount.toLocaleString('tr-TR')} komisyon kazandın. (Level 1)`,
          },
        });
      }

      // 4. Level 2 commission
      if (user.grandReferredById) {
        const lvl2Amount = PREMIUM_PRICE * LEVEL2_RATE;
        await tx.user.update({
          where: { id: user.grandReferredById },
          data: { balance: { increment: lvl2Amount } },
        });
        await tx.commission.create({
          data: { fromUserId: user.id, toUserId: user.grandReferredById, level: 2, amount: lvl2Amount },
        });
        await tx.notification.create({
          data: {
            userId: user.grandReferredById,
            type: 'commission',
            title: 'Yeni Komisyon! 💰',
            message: `${user.name} üzerinden ₺${lvl2Amount.toLocaleString('tr-TR')} komisyon kazandın. (Level 2)`,
          },
        });
      }
    });

    return successResponse(null, 'Ödeme başarılı! Premium üyeliğiniz aktif edildi.');
  } catch (error) {
    console.error('Payment error:', error);
    return errorResponse('Ödeme işlemi sırasında bir hata oluştu.', 500);
  }
}
