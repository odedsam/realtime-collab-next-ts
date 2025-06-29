import { User } from './db';

export interface SessionData {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AccountType {
  EMAIL = 'EMAIL',
  OAUTH = 'OAUTH',
}

export enum PrismaOAuthProvider {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  EMAIL = 'EMAIL',
}
export interface UserPayload {
  userId: string;
  sessionToken?: string;
  email?: string;
  role?: string;
}
export interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

export interface PasswordStrengthAnalyzer {
  score: number;
  feedback: string[];
  isStrong: boolean;
}
export interface CheckRateLimit {
  allowed: boolean;
  retryAfter?: number;
}

export type AuthUserMinimal = Pick<User, 'id' | 'email' | 'name' | 'avatar' | 'role' | 'emailVerified'>;

export interface AuthResponse {
  user: AuthUserMinimal;
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
  deviceFingerprint: string;
}
