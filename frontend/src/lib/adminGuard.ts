import { NextRequest } from 'next/server';
import { prisma } from './prisma';
import { getAuthFromRequest } from './auth';
import { unauthorizedResponse } from './apiResponse';

export async function requireAdminAuth(request: NextRequest) {
  const auth = getAuthFromRequest(request);
  if (!auth) return { error: unauthorizedResponse('Yetkisiz erişim.') };

  const user = await prisma.user.findUnique({
    where: { id: auth.id },
    select: { id: true, role: true, isActive: true },
  });

  if (!user || user.role !== 'ADMIN' || !user.isActive) {
    return { error: unauthorizedResponse('Bu işlem için admin yetkisi gereklidir.') };
  }

  return { adminId: user.id };
}
