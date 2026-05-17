import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const JWT_SECRET = process.env.JWT_SECRET;

export interface JWTPayload {
  id: number;
  iat?: number;
  exp?: number;
}

export function signToken(payload: { id: number }, expiresIn = '7d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

export function getAuthFromRequest(request: Request): JWTPayload | null {
  // Try Authorization header first (for API clients)
  const authHeader = request.headers.get('authorization');
  const headerToken = getTokenFromHeader(authHeader);
  if (headerToken) return verifyToken(headerToken);

  // Try HttpOnly cookie (for browser requests)
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  if (match?.[1]) return verifyToken(match[1]);

  return null;
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60,
  path: '/',
};
