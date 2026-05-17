import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/apiResponse';

const profileSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  phone: z.string().max(20).optional().nullable(),
  profession: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  about: z.string().max(1000).optional().nullable(),
  educationArea: z.string().max(100).optional().nullable(),
  experienceLevel: z.string().max(50).optional().nullable(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        role: true,
        refCode: true,
        balance: true,
        avatar: true,
        phone: true,
        profession: true,
        city: true,
        about: true,
        educationArea: true,
        experienceLevel: true,
      },
    });

    if (!user) return unauthorizedResponse();
    return successResponse({ ...user, balance: Number(user.balance) });
  } catch (error) {
    console.error('Profile GET error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: auth.id },
      data: parsed.data,
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

    return successResponse(
      { ...updatedUser, balance: Number(updatedUser.balance) },
      'Profil güncellendi.'
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
