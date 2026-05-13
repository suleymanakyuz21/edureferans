import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const notifications = await prisma.notification.findMany({
      where: { userId: auth.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse(notifications);
  } catch (error) {
    console.error('Notifications GET error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    await prisma.notification.updateMany({
      where: { userId: auth.id, isRead: false },
      data: { isRead: true },
    });

    return successResponse(null, 'Tüm bildirimler okundu olarak işaretlendi.');
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
