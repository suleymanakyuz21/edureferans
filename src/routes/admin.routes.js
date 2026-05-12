const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Note: In a real app, protect this with an admin role check
router.get('/users', adminController.getAllUsers);
router.get('/payments', adminController.getAllPayments);
router.get('/commissions', adminController.getAllCommissions);

module.exports = router;
