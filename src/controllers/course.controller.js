const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponse } = require('../utils/apiResponse');

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return successResponse(res, 200, 'Courses retrieved successfully', courses);
    } catch (error) {
        next(error);
    }
};

const getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await prisma.course.findUnique({
            where: { id: parseInt(id) }
        });
        
        if (!course) {
            return successResponse(res, 404, 'Course not found');
        }
        
        return successResponse(res, 200, 'Course retrieved successfully', course);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCourses,
    getCourseById
};
