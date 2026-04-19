import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'jans-secret-key-2024';

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: number; username: string; nombre: string; rol: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jans_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
