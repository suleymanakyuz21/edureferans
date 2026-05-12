const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Public
exports.createTicket = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return errorResponse(res, 400, 'Lütfen tüm alanları doldurun.');
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                name,
                email,
                message,
                status: 'OPEN'
            }
        });

        return successResponse(res, 201, 'Destek talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.', ticket);
    } catch (error) {
        console.error('Support Ticket Error:', error);
        return errorResponse(res, 500, 'Destek talebi oluşturulurken bir hata oluştu.');
    }
};
