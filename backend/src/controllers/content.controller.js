const contentService = require('../services/content.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Courses
const getCourses = async (req, res) => {
  try {
    const courses = await contentService.getCourses();
    return successResponse(res, 200, 'Kurslar getirildi.', courses);
  } catch (error) {
    return errorResponse(res, 500, 'Kurslar alınamadı.');
  }
};

// Notifications
const getNotifications = async (req, res) => {
  try {
    const data = await contentService.getNotifications(req.user.id);
    return successResponse(res, 200, 'Bildirimler getirildi.', data);
  } catch (error) {
    return errorResponse(res, 500, 'Bildirimler alınamadı.');
  }
};

const markAllRead = async (req, res) => {
  try {
    await contentService.markNotificationsRead(req.user.id);
    return successResponse(res, 200, 'Tüm bildirimler okundu işaretlendi.');
  } catch (error) {
    return errorResponse(res, 500, 'İşlem başarısız.');
  }
};

// Support
const createTicket = async (req, res) => {
  try {
    const ticket = await contentService.createTicket(req.body);
    return successResponse(res, 201, 'Destek talebiniz alındı.', ticket);
  } catch (error) {
    return errorResponse(res, 400, 'Talebiniz iletilemedi.');
  }
};

module.exports = {
  getCourses,
  getNotifications,
  markAllRead,
  createTicket,
};
