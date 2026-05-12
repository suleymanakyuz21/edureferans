const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponse } = require('../utils/apiResponse');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, balance: true, isPremium: true, createdAt: true }
        });
        return successResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error) {
        next(error);
    }
};

const getAllPayments = async (req, res, next) => {
    try {
        const payments = await prisma.payment.findMany({
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return successResponse(res, 200, 'Payments retrieved successfully', payments);
    } catch (error) {
        next(error);
    }
};

const getAllCommissions = async (req, res, next) => {
    try {
        const commissions = await prisma.commission.findMany({
            include: {
                fromUser: { select: { name: true, email: true } },
                toUser: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return successResponse(res, 200, 'Commissions retrieved successfully', commissions);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getAllPayments,
    getAllCommissions
};
