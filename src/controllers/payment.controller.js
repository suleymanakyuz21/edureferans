const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponse, errorResponse } = require('../utils/apiResponse');

const mockPaymentSuccess = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const amount = 10000; // 10.000 TL

        // Check if already premium
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user.isPremium) {
            return errorResponse(res, 400, 'User is already a premium member.');
        }

        // Start Transaction
        await prisma.$transaction(async (tx) => {
            // 1. Create Payment Record
            await tx.payment.create({
                data: {
                    userId,
                    amount,
                    status: 'COMPLETED'
                }
            });

            // 2. Update user to premium
            await tx.user.update({
                where: { id: userId },
                data: { isPremium: true }
            });

            // 3. Referral Logic
            if (user.referredById) {
                // Level 1: 25%
                const lvl1Amount = amount * 0.25;
                await tx.user.update({
                    where: { id: user.referredById },
                    data: { balance: { increment: lvl1Amount } }
                });
                await tx.commission.create({
                    data: {
                        fromUserId: userId,
                        toUserId: user.referredById,
                        level: 1,
                        amount: lvl1Amount
                    }
                });

                // Create Notification for Level 1
                await tx.notification.create({
                    data: {
                        userId: user.referredById,
                        type: 'commission',
                        title: 'Yeni Komisyon! 💰',
                        message: `${user.name} üzerinden ₺${lvl1Amount.toLocaleString()} komisyon kazandın. (Level 1)`
                    }
                });
            }

            if (user.grandReferredById) {
                // Level 2: 10%
                const lvl2Amount = amount * 0.10;
                await tx.user.update({
                    where: { id: user.grandReferredById },
                    data: { balance: { increment: lvl2Amount } }
                });
                await tx.commission.create({
                    data: {
                        fromUserId: userId,
                        toUserId: user.grandReferredById,
                        level: 2,
                        amount: lvl2Amount
                    }
                });

                // Create Notification for Level 2
                await tx.notification.create({
                    data: {
                        userId: user.grandReferredById,
                        type: 'commission',
                        title: 'Yeni Komisyon! 💰',
                        message: `${user.name} üzerinden ₺${lvl2Amount.toLocaleString()} komisyon kazandın. (Level 2)`
                    }
                });
            }
        });

        return successResponse(res, 200, 'Payment successful, premium activated.');
    } catch (error) {
        next(error);
    }
};

module.exports = {
    mockPaymentSuccess
};
