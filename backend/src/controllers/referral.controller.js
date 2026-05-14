const referralService = require('../services/referral.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getStats = async (req, res) => {
  try {
    const stats = await referralService.getStats(req.user.id);
    return successResponse(res, 200, 'Referans istatistikleri getirildi.', stats);
  } catch (error) {
    return errorResponse(res, 500, 'İstatistikler alınamadı.');
  }
};

const upgradePremium = async (req, res) => {
  try {
    const user = await referralService.processPremiumUpgrade(req.user.id);
    return successResponse(res, 200, 'Tebrikler! Premium üyeliğiniz aktif edildi.', user);
  } catch (error) {
    return errorResponse(res, 400, 'Yükseltme işlemi başarısız oldu.');
  }
};

module.exports = {
  getStats,
  upgradePremium,
};
