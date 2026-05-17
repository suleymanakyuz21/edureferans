const prisma = require('../config/prisma');

class AdminService {
  async getDashboardStats() {
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

    return {
      totalUsers,
      premiumUsers,
      normalUsers: totalUsers - premiumUsers,
      totalCourses,
      totalRevenue: Number(totalRevenue._sum.amount ?? 0),
      pendingPayouts,
      recentUsers,
    };
  }

  async getAllUsers(page = 1, limit = 20, search = '') {
    const where = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, isPremium: true,
          isActive: true, balance: true, createdAt: true,
          _count: { select: { referrals: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => ({ ...u, balance: Number(u.balance) })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserDetails(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referrals: { select: { id: true, name: true, email: true, isPremium: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
        sessions: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!user) return null;
    return {
      ...user,
      balance: Number(user.balance),
      payments: user.payments.map((p) => ({ ...p, amount: Number(p.amount) })),
    };
  }

  async updateUserStatus(userId, statusData, adminId) {
    // Whitelist: only allow toggling isActive and isPremium
    const { isActive, isPremium } = statusData;
    const data = {};
    if (typeof isActive === 'boolean') data.isActive = isActive;
    if (typeof isPremium === 'boolean') data.isPremium = isPremium;

    if (Object.keys(data).length === 0) {
      throw new Error('Güncellenecek geçerli bir alan bulunamadı.');
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    await prisma.auditLog.create({
      data: {
        adminId,
        action: 'UPDATE_USER_STATUS',
        targetId: String(userId),
        details: JSON.stringify(data),
      },
    });

    return user;
  }

  async createCourse(courseData, adminId) {
    const { title, description, videoUrl, provider, thumbnail, category, level, instructor, duration } = courseData;
    if (!title || !description || !videoUrl || !category) {
      throw new Error('Başlık, açıklama, video URL ve kategori zorunludur.');
    }

    const course = await prisma.course.create({
      data: { title, description, videoUrl, provider: provider || 'Mux', thumbnail, category, level, instructor, duration },
    });

    await prisma.auditLog.create({
      data: { adminId, action: 'CREATE_COURSE', targetId: String(course.id), details: course.title },
    });

    return course;
  }

  async createAnnouncement(announcementData) {
    const { title, message, type } = announcementData;
    if (!title || !message || !type) throw new Error('Başlık, mesaj ve tür zorunludur.');
    return prisma.announcement.create({ data: { title, message, type } });
  }
}

module.exports = new AdminService();
