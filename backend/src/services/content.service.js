const prisma = require('../config/prisma');

class ContentService {
  // Courses
  async getCourses() {
    return await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Notifications
  async getNotifications(userId) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { notifications, unreadCount };
  }

  async markNotificationsRead(userId) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Support
  async createTicket(ticketData) {
    return await prisma.supportTicket.create({
      data: {
        ...ticketData,
        status: 'OPEN',
      },
    });
  }
}

module.exports = new ContentService();
