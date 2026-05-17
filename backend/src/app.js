const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorResponse } = require('./utils/apiResponse');

const app = express();

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3001').split(',');

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps, Polar webhooks)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/referral', require('./routes/referral.routes'));
app.use('/api/content', require('./routes/content.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

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
