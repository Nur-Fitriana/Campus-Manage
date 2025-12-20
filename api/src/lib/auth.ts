// File: src/lib/auth.ts

import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'ganti_dengan_secret_key_yang_kuat';
const JWT_EXPIRES_IN = '7d';

export interface UserPayload {
  id: string;
  npm: string;
  role: Role;
}

// Fungsi untuk membuat token JWT
export const createToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Fungsi untuk memverifikasi token dan mengambil payload
export const verifyToken = (token: string): UserPayload | null => {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    return payload;
  } catch (error) {
    return null; // Token tidak valid atau kedaluwarsa
  }
};

// Fungsi untuk mendapatkan token dari header (Bearer Token)
export const getTokenFromRequest = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); 
  }
  return null;
};