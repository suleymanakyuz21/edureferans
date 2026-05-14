const prisma = require('../config/prisma');

class UserService {
  async getProfile(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        refCode: true,
        isPremium: true,
        balance: true,
        profession: true,
        city: true,
        about: true,
        educationArea: true,
        experienceLevel: true,
      },
    });
  }

  async updateProfile(userId, profileData) {
    const { name, phone, profession, city, about, educationArea, experienceLevel } = profileData;

    return await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        profession,
        city,
        about,
        educationArea,
        experienceLevel,
      },
    });
  }
}

module.exports = new UserService();
