const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

// Public
router.get('/courses', contentController.getCourses);
router.post('/support', contentController.createTicket);

// Protected
router.get('/notifications', authenticateJWT, contentController.getNotifications);
router.patch('/notifications', authenticateJWT, contentController.markAllRead);

module.exports = router;
