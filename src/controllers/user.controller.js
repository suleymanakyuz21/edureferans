const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponse } = require('../utils/apiResponse');

const getDashboardData = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                referrals: true,
                grandReferrals: true,
                commissionsEarned: {
                    include: { fromUser: true },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                payments: true,
                sessions: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        // Fetch all commissions to calculate totals accurately
        const allCommissions = await prisma.commission.findMany({
            where: { toUserId: userId }
        });

        const totalEarned = allCommissions.reduce((sum, comm) => sum + comm.amount, 0);
        const level1Earnings = allCommissions
            .filter(c => c.level === 1)
            .reduce((sum, comm) => sum + comm.amount, 0);
        const level2Earnings = allCommissions
            .filter(c => c.level === 2)
            .reduce((sum, comm) => sum + comm.amount, 0);
        
        return successResponse(res, 200, 'Dashboard data retrieved successfully', {
            balance: user.balance,
            totalEarned,
            level1Earnings,
            level2Earnings,
            refCode: user.refCode,
            isPremium: user.isPremium,
            referralsCount: user.referrals.length,
            grandReferralsCount: user.grandReferrals.length,
            phone: user.phone,
            recentCommissions: user.commissionsEarned.map(c => ({
                amount: c.amount,
                level: c.level,
                from: c.fromUser.name,
                date: c.createdAt
            })),
            payments: user.payments,
            sessions: user.sessions
        });
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, phone, profession, city, about, educationArea, experienceLevel } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone,
                profession,
                city,
                about,
                educationArea,
                experienceLevel
            }
        });

        return successResponse(res, 200, 'Profil başarıyla güncellendi', {
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profession: updatedUser.profession,
                city: updatedUser.city,
                about: updatedUser.about,
                educationArea: updatedUser.educationArea,
                experienceLevel: updatedUser.experienceLevel,
                isPremium: updatedUser.isPremium
            }
        });
    } catch (error) {
        next(error);
    }
};

const upgradePro = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isPremium: true }
        });

        return successResponse(res, 200, 'Tebrikler! Hesabınız Pro seviyesine yükseltildi.', {
            isPremium: updatedUser.isPremium
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardData,
    updateProfile,
    upgradePro
};
