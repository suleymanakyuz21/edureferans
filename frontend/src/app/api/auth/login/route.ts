import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse('E-posta ve şifre zorunludur.');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse('E-posta veya şifre hatalı.', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse('E-posta veya şifre hatalı.', 401);
    }

    if (!user.isVerified) {
      return errorResponse('Lütfen önce e-posta adresinizi doğrulayın.', 403);
    }

    // Record session
    const ua = request.headers.get('user-agent') || 'Unknown';
    let device = 'Desktop';
    let browser = 'Other';
    if (/mobile/i.test(ua)) device = 'Mobile';
    else if (/tablet/i.test(ua)) device = 'Tablet';
    else if (/macintosh/i.test(ua)) device = 'MacBook';
    if (/chrome/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edge/i.test(ua)) browser = 'Edge';

    await prisma.session.create({
      data: { userId: user.id, device, browser, active: true },
    }).catch(console.error);

    const token = signToken({ id: user.id });

    return successResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        refCode: user.refCode,
        balance: user.balance,
        avatar: user.avatar,
      },
    }, 'Giriş başarılı');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Sunucu hatası. Lütfen tekrar deneyin.', 500);
  }
}
