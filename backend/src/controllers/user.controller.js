const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    return successResponse(res, 200, 'Profil başarıyla getirildi.', user);
  } catch (error) {
    return errorResponse(res, 500, 'Profil bilgileri alınamadı.');
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return successResponse(res, 200, 'Profil başarıyla güncellendi.', user);
  } catch (error) {
    return errorResponse(res, 400, 'Güncelleme işlemi başarısız oldu.');
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
