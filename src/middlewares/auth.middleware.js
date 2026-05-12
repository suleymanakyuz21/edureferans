const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { errorResponse } = require('../utils/apiResponse');

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                return errorResponse(res, 403, 'Invalid or expired token.');
            }

            try {
                const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
                if (!dbUser) {
                    return errorResponse(res, 404, 'User not found.');
                }
                // Don't pass password
                const { password, ...userWithoutPassword } = dbUser;
                req.user = userWithoutPassword;
                next();
            } catch (error) {
                return errorResponse(res, 500, 'Internal server error during authentication.');
            }
        });
    } else {
        errorResponse(res, 401, 'Authorization header missing.');
    }
};

const requirePremium = (req, res, next) => {
    if (req.user && req.user.isPremium) {
        next();
    } else {
        errorResponse(res, 403, 'Premium membership required to access this resource.');
    }
};

module.exports = {
    authenticateJWT,
    requirePremium
};
