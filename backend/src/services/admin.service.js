const prisma = require('../config/prisma');

class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      premiumUsers,
      totalCourses,
      totalRevenue,
      pendingPayouts,
      recentUsers,
    ] = await Promise.all([
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

    return {
      totalUsers,
      premiumUsers,
      normalUsers: totalUsers - premiumUsers,
      totalCourses,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingPayouts,
      recentUsers,
    };
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        isPremium: true,
        isActive: true,
        balance: true,
        createdAt: true,
        _count: {
          select: { referrals: true },
        },
      },
    });
  }

  async getUserDetails(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: true,
        payments: true,
        sessions: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async updateUserStatus(userId, statusData, adminId) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: statusData,
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'UPDATE_USER_STATUS',
        targetId: String(userId),
        details: JSON.stringify(statusData),
      },
    });

    return user;
  }

  async createCourse(courseData, adminId) {
    const course = await prisma.course.create({
      data: courseData,
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'CREATE_COURSE',
        targetId: String(course.id),
        details: course.title,
      },
    });

    return course;
  }

  async createAnnouncement(announcementData) {
    return await prisma.announcement.create({
      data: announcementData,
    });
  }
}

module.exports = new AdminService();
