export enum AccountType {
  EMAIL = 'EMAIL',
  OAUTH = 'OAUTH',
}

export enum PrismaOAuthProvider {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
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
