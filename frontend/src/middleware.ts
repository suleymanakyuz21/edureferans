import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/admin'];
const authRoutes = ['/login', '/register'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    const payload = verifyToken(token);
    if (!payload) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      const res = NextResponse.redirect(url);
      res.cookies.set('token', '', { maxAge: 0, path: '/' });
      return res;
    }

    // Admin-only routes: we check role in the API layer too, but redirect at edge for UX
    if (isAdminRoute) {
      // Can't check role without DB call at edge — rely on API-level guard
      // If they have a valid token, let them through; the API routes enforce role
    }
  }

  if (isAuthRoute && token) {
    const payload = verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
