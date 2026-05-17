import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/adminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const guard = await requireAdminAuth(request);
  if ('error' in guard) return guard.error;

  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
    const limit = Math.min(50, parseInt(url.searchParams.get('limit') ?? '20', 10));
    const search = url.searchParams.get('search') ?? '';

    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          isPremium: true,
          isActive: true,
          balance: true,
          role: true,
          createdAt: true,
          _count: { select: { referrals: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({
      users: users.map((u) => ({ ...u, balance: Number(u.balance) })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
