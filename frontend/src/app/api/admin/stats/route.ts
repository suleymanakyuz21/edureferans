import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminAuth } from '@/lib/adminGuard';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(request: NextRequest) {
  const guard = await requireAdminAuth(request);
  if ('error' in guard) return guard.error;

  try {
    const [totalUsers, premiumUsers, totalCourses, totalRevenue, pendingPayouts, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isPremium: true } }),
        prisma.course.count(),
        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
        prisma.payoutRequest.count({ where: { status: 'PENDING' } }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, email: true, createdAt: true, isPremium: true },
        }),
      ]);

    return successResponse({
      totalUsers,
      premiumUsers,
      normalUsers: totalUsers - premiumUsers,
      totalCourses,
      totalRevenue: Number(totalRevenue._sum.amount ?? 0),
      pendingPayouts,
      recentUsers,
      conversionRate: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : '0.0',
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return errorResponse('Sunucu hatası.', 500);
  }
}
