const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { authenticateJWT, requirePremium } = require('../middlewares/auth.middleware');

router.get('/', authenticateJWT, requirePremium, courseController.getAllCourses);
router.get('/:id', authenticateJWT, requirePremium, courseController.getCourseById);

module.exports = router;
