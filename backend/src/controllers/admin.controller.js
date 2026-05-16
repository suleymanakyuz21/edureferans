const adminService = require('../services/admin.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, 200, 'Admin istatistikleri getirildi.', stats);
  } catch (error) {
    return errorResponse(res, 500, 'İstatistikler alınamadı.');
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    return successResponse(res, 200, 'Kullanıcı listesi getirildi.', users);
  } catch (error) {
    return errorResponse(res, 500, 'Kullanıcılar alınamadı.');
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await adminService.getUserDetails(parseInt(req.params.id));
    if (!user) return errorResponse(res, 404, 'Kullanıcı bulunamadı.');
    return successResponse(res, 200, 'Kullanıcı detayı getirildi.', user);
  } catch (error) {
    return errorResponse(res, 500, 'Kullanıcı detayı alınamadı.');
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const updatedUser = await adminService.updateUserStatus(
      parseInt(req.params.id),
      req.body,
      req.user.id
    );
    return successResponse(res, 200, 'Kullanıcı durumu güncellendi.', updatedUser);
  } catch (error) {
    return errorResponse(res, 400, 'Kullanıcı güncellenemedi.');
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await adminService.createCourse(req.body, req.user.id);
    return successResponse(res, 201, 'Kurs başarıyla eklendi.', course);
  } catch (error) {
    return errorResponse(res, 400, 'Kurs eklenemedi.');
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const announcement = await adminService.createAnnouncement(req.body);
    return successResponse(res, 201, 'Duyuru oluşturuldu.', announcement);
  } catch (error) {
    return errorResponse(res, 400, 'Duyuru oluşturulamadı.');
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserDetails,
  updateUserStatus,
  createCourse,
  createAnnouncement,
};
