import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(courses);
  } catch (error) {
    console.error('Courses GET error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
