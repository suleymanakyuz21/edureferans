import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/adminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';

const updateSchema = z.object({
  isActive: z.boolean().optional(),
  isPremium: z.boolean().optional(),
}).strict();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminAuth(request);
  if ('error' in guard) return guard.error;

  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) return errorResponse('Geçersiz kullanıcı ID.', 400);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: { select: { id: true, name: true, email: true, isPremium: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
        payoutRequests: { orderBy: { createdAt: 'desc' }, take: 10 },
        sessions: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) return errorResponse('Kullanıcı bulunamadı.', 404);

    return successResponse({
      ...user,
      balance: Number(user.balance),
      payments: user.payments.map((p) => ({ ...p, amount: Number(p.amount) })),
      payoutRequests: user.payoutRequests.map((r) => ({ ...r, amount: Number(r.amount) })),
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdminAuth(request);
  if ('error' in guard) return guard.error;

  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) return errorResponse('Geçersiz kullanıcı ID.', 400);

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(`Geçersiz alanlar: ${parsed.error.issues[0].message}`, 400);
    }

    if (Object.keys(parsed.data).length === 0) {
      return errorResponse('Güncellenecek alan bulunamadı.', 400);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      select: { id: true, name: true, email: true, isPremium: true, isActive: true },
    });

    await prisma.auditLog.create({
      data: {
        adminId: guard.adminId,
        action: 'UPDATE_USER',
        targetId: String(userId),
        details: JSON.stringify(parsed.data),
      },
    });

    return successResponse(user, 'Kullanıcı güncellendi.');
  } catch (error) {
    console.error('Admin update user error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
