const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

router.get('/stats', authenticateJWT, referralController.getStats);
router.post('/upgrade', authenticateJWT, referralController.upgradePremium);

module.exports = router;
