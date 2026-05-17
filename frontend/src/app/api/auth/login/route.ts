import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, COOKIE_OPTIONS } from '@/lib/auth';
import { errorResponse } from '@/lib/apiResponse';

// Simple in-memory rate limiter: 5 attempts per 15 minutes per IP
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  if (isRateLimited(ip)) {
    return errorResponse('Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.', 429);
  }

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return errorResponse('E-posta ve şifre zorunludur.');
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Generic error prevents user enumeration
    const genericError = errorResponse('E-posta veya şifre hatalı.', 401);
    if (!user) return genericError;

    if (!user.isActive) {
      return errorResponse('Hesabınız askıya alınmıştır. Destek ile iletişime geçin.', 403);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return genericError;

    if (!user.isVerified) {
      return errorResponse('Lütfen önce e-posta adresinizi doğrulayın.', 403);
    }

    // Reset rate limit on successful login
    loginAttempts.delete(ip);

    const token = signToken({ id: user.id });

    // Record session
    const ua = request.headers.get('user-agent') ?? 'Unknown';
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

    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isPremium: user.isPremium,
          role: user.role,
          refCode: user.refCode,
          balance: Number(user.balance),
          avatar: user.avatar,
        },
      },
    });

    response.cookies.set('token', token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Sunucu hatası. Lütfen tekrar deneyin.', 500);
  }
}
