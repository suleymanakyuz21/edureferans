const prisma = require('../config/prisma');

class ReferralService {
  async getStats(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          select: { id: true, name: true, createdAt: true, isPremium: true },
        },
        commissions: {
          orderBy: { createdAt: 'desc' },
          include: { fromUser: { select: { name: true } } },
        },
      },
    });

    const level2Count = await prisma.user.count({
      where: { grandReferredById: userId },
    });

    return {
      balance: user.balance,
      referralCount: user.referrals.length,
      level2Count: level2Count,
      referrals: user.referrals,
      commissions: user.commissions,
    };
  }

  async processPremiumUpgrade(userId) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { isPremium: true },
      });

      // L1 Commission (₺150)
      if (user.referredById) {
        await tx.user.update({
          where: { id: user.referredById },
          data: { balance: { increment: 150 } },
        });

        await tx.commission.create({
          data: {
            userId: user.referredById,
            fromUserId: user.id,
            amount: 150,
            level: 1,
          },
        });

        await tx.notification.create({
          data: {
            userId: user.referredById,
            type: 'commission',
            title: 'Komisyon Kazandın! 💰',
            message: `${user.name} premium oldu, ₺150 hesabına eklendi.`,
          },
        });

        // L2 Commission (₺50)
        if (user.grandReferredById) {
          await tx.user.update({
            where: { id: user.grandReferredById },
            data: { balance: { increment: 50 } },
          });

          await tx.commission.create({
            data: {
              userId: user.grandReferredById,
              fromUserId: user.id,
              amount: 50,
              level: 2,
            },
          });

          await tx.notification.create({
            data: {
              userId: user.grandReferredById,
              type: 'commission',
              title: 'L2 Komisyon! 💸',
              message: `Alt referansın ${user.name} premium oldu, ₺50 kazandın.`,
            },
          });
        }
      }

      return user;
    });
  }
}

module.exports = new ReferralService();
