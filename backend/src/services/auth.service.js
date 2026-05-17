const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');

class AuthService {
  async generateRefCode(name) {
    const refCode = name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
    const codeExists = await prisma.user.findUnique({ where: { refCode } });
    if (codeExists) return this.generateRefCode(name);
    return refCode;
  }

  async register(userData) {
    const { name, email, password, referralCode } = userData;

    if (!name || !email || !password) throw new Error('Ad, e-posta ve şifre zorunludur.');
    if (password.length < 8) throw new Error('Şifre en az 8 karakter olmalıdır.');

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) throw new Error('Bu e-posta adresi zaten kullanımda.');

    const hashedPassword = await bcrypt.hash(password, 12);
    const refCode = await this.generateRefCode(name);

    let referredById = null;
    let grandReferredById = null;

    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { refCode: referralCode } });
      // Only accept referrals from active, verified users
      if (referrer && referrer.isActive && referrer.isVerified) {
        referredById = referrer.id;
        grandReferredById = referrer.referredById;
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        refCode,
        referredById,
        grandReferredById,
        isVerified: false,
        verificationCode: otp,
        verificationCodeExpiresAt: otpExpiresAt,
      },
    });

    // Log for dev — replace with real email (Resend) in production
    console.log(`\n[DEV] VERIFICATION CODE for ${email}: ${otp}\n`);
    return { user, otp: null }; // Never expose OTP in response
  }

  async verifyEmail(email, code) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new Error('Kullanıcı bulunamadı.');
    if (user.isVerified) throw new Error('Hesap zaten doğrulanmış.');

    if (user.verificationCodeExpiresAt && new Date() > user.verificationCodeExpiresAt) {
      throw new Error('Doğrulama kodunun süresi dolmuş. Lütfen tekrar kayıt olun.');
    }

    if (user.verificationCode !== code) throw new Error('Geçersiz doğrulama kodu.');

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationCode: null, verificationCodeExpiresAt: null },
    });

    if (updatedUser.referredById) {
      await prisma.notification.create({
        data: {
          userId: updatedUser.referredById,
          type: 'referral',
          title: 'Yeni Referans! 👤',
          message: `${updatedUser.name} referans linkin ile aramıza katıldı.`,
        },
      }).catch(console.error);
    }

    const token = this.generateToken(updatedUser.id);
    return { token, user: updatedUser };
  }

  async login(email, password, ip, userAgent) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new Error('Geçersiz bilgiler.');

    if (!user.isActive) throw new Error('Hesabınız askıya alınmıştır. Destek ile iletişime geçin.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Geçersiz bilgiler.');

    if (!user.isVerified) throw new Error('Lütfen önce e-posta adresinizi doğrulayın.');

    const token = this.generateToken(user.id);

    await prisma.session.create({
      data: {
        userId: user.id,
        device: this.parseDevice(userAgent),
        browser: this.parseBrowser(userAgent),
        ip: ip || '127.0.0.1',
        active: true,
      },
    }).catch(console.error);

    return { token, user };
  }

  generateToken(id) {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
  }

  parseDevice(ua = '') {
    if (/mobile/i.test(ua)) return 'Mobile';
    if (/tablet/i.test(ua)) return 'Tablet';
    if (/macintosh/i.test(ua)) return 'MacBook';
    if (/windows/i.test(ua)) return 'Windows PC';
    return 'Desktop';
  }

  parseBrowser(ua = '') {
    if (/edg/i.test(ua)) return 'Edge';
    if (/chrome/i.test(ua)) return 'Chrome';
    if (/firefox/i.test(ua)) return 'Firefox';
    if (/safari/i.test(ua)) return 'Safari';
    return 'Other';
  }
}

module.exports = new AuthService();
