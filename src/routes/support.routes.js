const express = require('express');
const router = express.Router();
const { createTicket } = require('../controllers/support.controller');

// @route   POST /api/support
router.post('/', createTicket);

module.exports = router;
