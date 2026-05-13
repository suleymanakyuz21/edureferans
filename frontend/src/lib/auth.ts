import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

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
  const authHeader = request.headers.get('authorization');
  const token = getTokenFromHeader(authHeader);
  if (!token) return null;
  return verifyToken(token);
}
