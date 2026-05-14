const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

router.get('/profile', authenticateJWT, userController.getProfile);
router.patch('/profile', authenticateJWT, userController.updateProfile);

module.exports = router;
