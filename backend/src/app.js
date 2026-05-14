const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorResponse } = require('./utils/apiResponse');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/referral', require('./routes/referral.routes'));
app.use('/api/content', require('./routes/content.routes'));

// 404 Handler
app.use((req, res) => {
  return errorResponse(res, 404, 'Aradığınız sayfa bulunamadı.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err);
  return errorResponse(res, err.statusCode || 500, err.message || 'Sunucu hatası.');
});

module.exports = app;
