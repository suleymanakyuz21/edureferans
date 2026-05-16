const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

// Tüm admin rotaları JWT ve Admin rolü kontrolünden geçmeli
router.use(authenticateJWT, requireAdmin);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id', adminController.updateUserStatus);
router.post('/courses', adminController.createCourse);
router.post('/announcements', adminController.createAnnouncement);

module.exports = router;
