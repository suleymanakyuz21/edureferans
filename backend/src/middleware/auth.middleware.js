const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { errorResponse } = require('../utils/apiResponse');

const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Yetkilendirme başlığı eksik veya hatalı.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        isPremium: true,
        refCode: true,
        balance: true,
      },
    });

    if (!user) {
      return errorResponse(res, 404, 'Kullanıcı bulunamadı.');
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 403, 'Geçersiz veya süresi dolmuş token.');
  }
};

const requirePremium = (req, res, next) => {
  if (req.user && req.user.isPremium) {
    next();
  } else {
    return errorResponse(res, 403, 'Bu işlem için Premium üyelik gereklidir.');
  }
};

module.exports = {
  authenticateJWT,
  requirePremium,
};
