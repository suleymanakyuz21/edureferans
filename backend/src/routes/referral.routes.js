const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referral.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

// GET referral stats for the current user
router.get('/stats', authenticateJWT, referralController.getStats);

// NOTE: /upgrade endpoint intentionally removed.
// Premium upgrades are triggered exclusively via the verified Polar webhook.

module.exports = router;
