import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/adminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const guard = await requireAdminAuth(request);
  if ('error' in guard) return guard.error;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, parseInt(url.searchParams.get('limit') ?? '20', 10));

    const where = status && status !== 'all' ? { status } : {};

    const [requests, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.payoutRequest.count({ where }),
    ]);

    return successResponse({
      requests: requests.map((r) => ({ ...r, amount: Number(r.amount) })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin payouts GET error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}

const updatePayoutSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['PROCESSING', 'COMPLETED', 'REJECTED']),
  adminNote: z.string().max(500).optional(),
});

export async function PATCH(request: NextRequest) {
  const guard = await requireAdminAuth(request);
  if ('error' in guard) return guard.error;

  try {
    const body = await request.json();
    const parsed = updatePayoutSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0].message, 400);
    }

    const { id, status, adminNote } = parsed.data;

    return prisma.$transaction(async (tx) => {
      const payout = await tx.payoutRequest.findUnique({ where: { id } });
      if (!payout) return errorResponse('Çekim talebi bulunamadı.', 404);

      if (payout.status === 'COMPLETED' || payout.status === 'REJECTED') {
        return errorResponse('Bu talep zaten işlenmiş.', 400);
      }

      // If rejected, refund the balance
      if (status === 'REJECTED') {
        await tx.user.update({
          where: { id: payout.userId },
          data: { balance: { increment: Number(payout.amount) } },
        });
        await tx.notification.create({
          data: {
            userId: payout.userId,
            type: 'payment',
            title: 'Çekim Talebi Reddedildi',
            message: `₺${Number(payout.amount).toLocaleString('tr-TR')} çekim talebiniz reddedildi. Bakiyeniz iade edildi.${adminNote ? ` Not: ${adminNote}` : ''}`,
          },
        });
      } else if (status === 'COMPLETED') {
        await tx.notification.create({
          data: {
            userId: payout.userId,
            type: 'payment',
            title: 'Çekim Talebi Tamamlandı',
            message: `₺${Number(payout.amount).toLocaleString('tr-TR')} başarıyla hesabınıza aktarıldı.`,
          },
        });
      }

      const updated = await tx.payoutRequest.update({
        where: { id },
        data: { status, adminNote, processedAt: new Date() },
      });

      await tx.auditLog.create({
        data: {
          adminId: guard.adminId,
          action: `PAYOUT_${status}`,
          targetId: String(id),
          details: adminNote,
        },
      });

      return successResponse({ ...updated, amount: Number(updated.amount) }, 'Çekim talebi güncellendi.');
    });
  } catch (error) {
    console.error('Admin payout PATCH error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
