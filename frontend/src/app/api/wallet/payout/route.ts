import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/apiResponse';

const MIN_PAYOUT = 100;

const payoutSchema = z.discriminatedUnion('method', [
  z.object({
    method: z.literal('IBAN'),
    amount: z.number().min(MIN_PAYOUT),
    iban: z.string().min(10).max(34).regex(/^TR\d{24}$/, 'Geçerli bir IBAN giriniz (TR ile başlamalı)'),
    paparaId: z.undefined().optional(),
  }),
  z.object({
    method: z.literal('PAPARA'),
    amount: z.number().min(MIN_PAYOUT),
    paparaId: z.string().min(5).max(20),
    iban: z.undefined().optional(),
  }),
]);

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const body = await request.json();
    const parsed = payoutSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { method, amount, iban, paparaId } = parsed.data;

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: auth.id } });
      if (!user) return unauthorizedResponse();
      if (!user.isPremium) return errorResponse('Çekim yapabilmek için Premium üye olmanız gerekmektedir.', 403);

      if (Number(user.balance) < amount) {
        return errorResponse('Yetersiz bakiye.', 400);
      }

      const pendingExists = await tx.payoutRequest.findFirst({
        where: { userId: auth.id, status: 'PENDING' },
      });
      if (pendingExists) {
        return errorResponse('Zaten bekleyen bir çekim talebiniz var. Önce o işlemin tamamlanmasını bekleyin.', 400);
      }

      // Deduct balance immediately to prevent double-spend
      await tx.user.update({
        where: { id: auth.id },
        data: { balance: { decrement: amount } },
      });

      const payout = await tx.payoutRequest.create({
        data: {
          userId: auth.id,
          amount,
          status: 'PENDING',
          method,
          ...(iban && { iban }),
          ...(paparaId && { paparaId }),
        },
      });

      await tx.notification.create({
        data: {
          userId: auth.id,
          type: 'payment',
          title: 'Çekim Talebiniz Alındı',
          message: `₺${amount.toLocaleString('tr-TR')} çekim talebiniz incelemeye alındı. 1-3 iş günü içinde hesabınıza aktarılacaktır.`,
        },
      });

      return successResponse(
        { id: payout.id, amount, status: 'PENDING', method },
        'Çekim talebiniz başarıyla oluşturuldu.'
      );
    });
  } catch (error) {
    console.error('Payout error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return unauthorizedResponse();

    const requests = await prisma.payoutRequest.findMany({
      where: { userId: auth.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return successResponse(requests.map((r) => ({ ...r, amount: Number(r.amount) })));
  } catch (error) {
    console.error('Payout GET error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
