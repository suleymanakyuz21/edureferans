const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');

router.post('/mock-payment-success', authenticateJWT, paymentController.mockPaymentSuccess);

module.exports = router;
