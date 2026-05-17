const prisma = require('../config/prisma');

// Single source of truth for commission rates — must match frontend/src/lib/premiumUpgrade.ts
const PREMIUM_PRICE = 750;       // ₺750
const L1_RATE = 0.20;            // 20%
const L2_RATE = 0.10;            // 10%

class ReferralService {
  async getStats(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          select: { id: true, name: true, createdAt: true, isPremium: true },
        },
        commissionsEarned: {
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: { fromUser: { select: { name: true } } },
        },
      },
    });

    if (!user) throw new Error('Kullanıcı bulunamadı.');

    const level2Count = await prisma.user.count({
      where: { grandReferredById: userId },
    });

    return {
      balance: Number(user.balance),
      referralCount: user.referrals.length,
      level2Count,
      referrals: user.referrals,
      commissions: user.commissionsEarned.map((c) => ({
        ...c,
        amount: Number(c.amount),
      })),
    };
  }

  async processPremiumUpgrade(userId) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('Kullanıcı bulunamadı.');
      if (user.isPremium) return null; // Already done — idempotent

      await tx.user.update({
        where: { id: userId },
        data: { isPremium: true, premiumSince: new Date() },
      });

      await tx.payment.create({
        data: { userId, amount: PREMIUM_PRICE, status: 'COMPLETED' },
      });

      // L1 Commission (20%)
      if (user.referredById) {
        const l1Amount = parseFloat((PREMIUM_PRICE * L1_RATE).toFixed(2));

        await tx.user.update({
          where: { id: user.referredById },
          data: { balance: { increment: l1Amount } },
        });

        await tx.commission.create({
          data: {
            fromUserId: user.id,
            toUserId: user.referredById, // Correct field name: toUserId
            level: 1,
            amount: l1Amount,
          },
        });

        await tx.notification.create({
          data: {
            userId: user.referredById,
            type: 'commission',
            title: 'Komisyon Kazandın! 💰',
            message: `${user.name} premium oldu, ₺${l1Amount.toLocaleString('tr-TR')} hesabına eklendi. (L1)`,
          },
        });
      }

      // L2 Commission (10%)
      if (user.grandReferredById) {
        const l2Amount = parseFloat((PREMIUM_PRICE * L2_RATE).toFixed(2));

        await tx.user.update({
          where: { id: user.grandReferredById },
          data: { balance: { increment: l2Amount } },
        });

        await tx.commission.create({
          data: {
            fromUserId: user.id,
            toUserId: user.grandReferredById, // Correct field name: toUserId
            level: 2,
            amount: l2Amount,
          },
        });

        await tx.notification.create({
          data: {
            userId: user.grandReferredById,
            type: 'commission',
            title: 'L2 Komisyon! 💸',
            message: `Alt referansın ${user.name} premium oldu, ₺${l2Amount.toLocaleString('tr-TR')} kazandın. (L2)`,
          },
        });
      }

      return user;
    });
  }
}

module.exports = new ReferralService();
