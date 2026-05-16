const { errorResponse } = require('../utils/apiResponse');
const prisma = require('../config/prisma');

const requireAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return errorResponse(res, 403, 'Bu işlem için yetkiniz yok. (Admin Gerekli)');
    }

    req.admin = user;
    next();
  } catch (error) {
    return errorResponse(res, 500, 'Yetkilendirme kontrolü başarısız oldu.');
  }
};

module.exports = { requireAdmin };
