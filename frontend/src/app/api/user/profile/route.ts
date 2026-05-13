import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/apiResponse';

export async function PATCH(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const { name, phone, profession, city, about, educationArea, experienceLevel } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: auth.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(profession !== undefined && { profession }),
        ...(city !== undefined && { city }),
        ...(about !== undefined && { about }),
        ...(educationArea !== undefined && { educationArea }),
        ...(experienceLevel !== undefined && { experienceLevel }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        refCode: true,
        balance: true,
        avatar: true,
        phone: true,
        profession: true,
        city: true,
      },
    });

    return successResponse(updatedUser, 'Profil güncellendi.');
  } catch (error) {
    console.error('Profile update error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
