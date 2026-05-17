import { PrismaClient } from '@prisma/client';

// Single source of truth for commission rates
export const PREMIUM_PRICE = 750;      // ₺750 — must match your Polar product price
export const L1_COMMISSION_RATE = 0.20; // 20%
export const L2_COMMISSION_RATE = 0.10; // 10%

type PrismaTx = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export async function processPremiumUpgrade(userId: number, tx: PrismaTx, polarOrderId?: string) {
  // Idempotency: abort if already premium
  const user = await tx.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Kullanıcı bulunamadı.');
  if (user.isPremium) return null; // already done, not an error

  // If polarOrderId provided, check we haven't processed it already
  if (polarOrderId) {
    const existing = await tx.payment.findUnique({ where: { polarOrderId } });
    if (existing) return null; // idempotent — already handled
  }

  await tx.user.update({
    where: { id: userId },
    data: { isPremium: true, premiumSince: new Date() },
  });

  await tx.payment.create({
    data: {
      userId,
      amount: PREMIUM_PRICE,
      status: 'COMPLETED',
      ...(polarOrderId && { polarOrderId }),
    },
  });

  if (user.referredById) {
    const l1Amount = parseFloat((PREMIUM_PRICE * L1_COMMISSION_RATE).toFixed(2));

    await tx.user.update({
      where: { id: user.referredById },
      data: { balance: { increment: l1Amount } },
    });
    await tx.commission.create({
      data: { fromUserId: userId, toUserId: user.referredById, level: 1, amount: l1Amount },
    });
    await tx.notification.create({
      data: {
        userId: user.referredById,
        type: 'commission',
        title: 'Komisyon Kazandın! 💰',
        message: `${user.name} premium oldu, ₺${l1Amount.toLocaleString('tr-TR')} hesabına eklendi. (L1 — %${L1_COMMISSION_RATE * 100})`,
      },
    });
  }

  if (user.grandReferredById) {
    const l2Amount = parseFloat((PREMIUM_PRICE * L2_COMMISSION_RATE).toFixed(2));

    await tx.user.update({
      where: { id: user.grandReferredById },
      data: { balance: { increment: l2Amount } },
    });
    await tx.commission.create({
      data: { fromUserId: userId, toUserId: user.grandReferredById, level: 2, amount: l2Amount },
    });
    await tx.notification.create({
      data: {
        userId: user.grandReferredById,
        type: 'commission',
        title: 'L2 Komisyon Kazandın! 💸',
        message: `Alt referansın ${user.name} premium oldu, ₺${l2Amount.toLocaleString('tr-TR')} kazandın. (L2 — %${L2_COMMISSION_RATE * 100})`,
      },
    });
  }

  return user;
}
