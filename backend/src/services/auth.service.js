const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

class AuthService {
  async generateRefCode(name) {
    let refCode = name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
    const codeExists = await prisma.user.findUnique({ where: { refCode } });
    if (codeExists) return this.generateRefCode(name);
    return refCode;
  }

  async register(userData) {
    const { name, email, password, referralCode } = userData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error('Bu e-posta adresi zaten kullanımda.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const refCode = await this.generateRefCode(name);

    let referredById = null;
    let grandReferredById = null;

    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { refCode: referralCode } });
      if (referrer) {
        referredById = referrer.id;
        grandReferredById = referrer.referredById;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        refCode,
        referredById,
        grandReferredById,
        isVerified: false,
        verificationCode: otp,
      },
    });

    return { user, otp };
  }

  async verifyEmail(email, code) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Kullanıcı bulunamadı.');
    if (user.isVerified) throw new Error('Hesap zaten doğrulanmış.');
    if (user.verificationCode !== code) throw new Error('Geçersiz doğrulama kodu.');

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationCode: null },
    });

    if (updatedUser.referredById) {
      await prisma.notification.create({
        data: {
          userId: updatedUser.referredById,
          type: 'referral',
          title: 'Yeni Referans! 👤',
          message: `${updatedUser.name} referans linkin ile aramıza katıldı.`,
        },
      });
    }

    const token = this.generateToken(updatedUser.id);
    return { token, user: updatedUser };
  }

  async login(email, password, ip, userAgent) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Geçersiz bilgiler.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Geçersiz bilgiler.');

    if (!user.isVerified) throw new Error('Lütfen önce e-posta adresinizi doğrulayın.');

    const token = this.generateToken(user.id);

    // Session recording logic
    await prisma.session.create({
      data: {
        userId: user.id,
        device: this.parseDevice(userAgent),
        browser: this.parseBrowser(userAgent),
        ip: ip || '127.0.0.1',
        active: true,
      },
    });

    return { token, user };
  }

  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  parseDevice(ua) {
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    if (/macintosh/i.test(ua)) return 'MacBook';
    if (/windows/i.test(ua)) return 'Windows PC';
    return 'Desktop';
  }

  parseBrowser(ua) {
    if (/chrome/i.test(ua)) return 'Chrome';
    if (/safari/i.test(ua)) return 'Safari';
    if (/firefox/i.test(ua)) return 'Firefox';
    if (/edge/i.test(ua)) return 'Edge';
    return 'Other';
  }
}

module.exports = new AuthService();
