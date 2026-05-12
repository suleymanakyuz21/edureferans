require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const errorHandler = require('./src/middlewares/errorHandler.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static Files
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use('/views', express.static(path.join(__dirname, 'views')));

// API Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/payment', require('./src/routes/payment.routes'));
app.use('/api/courses', require('./src/routes/course.routes'));
app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api/admin', require('./src/routes/admin.routes'));
app.use('/api/notifications', require('./src/routes/notification.routes'));
app.use('/api/support', require('./src/routes/support.routes'));

// FAQ Route Bridge (Redirects to React App on port 5173)
app.get('/faq', (req, res) => {
    const hostname = req.hostname;
    res.redirect(`http://${hostname}:5173/faq`);
});

// Default Route (Frontend Landing Page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
