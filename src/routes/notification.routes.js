const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.get('/', authenticateJWT, notificationController.getNotifications);
router.put('/:id/read', authenticateJWT, notificationController.markAsRead);
router.put('/read-all', authenticateJWT, notificationController.markAllAsRead);
router.delete('/:id', authenticateJWT, notificationController.deleteNotification);

module.exports = router;
