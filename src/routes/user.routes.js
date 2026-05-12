const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.get('/dashboard', authenticateJWT, userController.getDashboardData);
router.put('/profile', authenticateJWT, userController.updateProfile);
router.post('/upgrade-pro', authenticateJWT, userController.upgradePro);

module.exports = router;
