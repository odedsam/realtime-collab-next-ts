import type { NextRequest } from 'next/server';
import type { AuthResponse } from '@/types/auth';
import { prisma } from '@/lib';
import { BCRYPT_ROUNDS } from '@/config/env';
import { SecurityUtils } from '@/lib/auth';
import { JWTUtils } from '@/utils/jwt';
import { SessionManager } from '@/lib/session';
import { ActivityLogger } from '@/utils';
import bcrypt from 'bcryptjs';

export async function signUpWithEmail(email: string, password: string, request: NextRequest): Promise<AuthResponse> {
  const ip = SecurityUtils.extractIP(request);
  const rateLimit = SecurityUtils.checkRateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    throw new Error(`Too many sign-up attempts. Try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.`);
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) throw new Error('Email already in use.');

  const strength = SecurityUtils.analyzePasswordStrength(password);
  if (!strength.isStrong) {
    throw new Error(`Password too weak. ${strength.feedback.join(', ')}`);
  }

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashed,
      emailVerified: false,
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      type: 'credentials',
      provider: 'email',
      providerAccountId: user.email,
    },
  });

  await ActivityLogger.log(user.id, 'email_signup', request);
  const { accessToken, refreshToken } = JWTUtils.generateTokenPair({ userId: user.id });
  const { sessionToken, deviceFingerprint } = await SessionManager.createSession(user.id, request, 'email');
  return { user, accessToken, refreshToken, sessionToken, deviceFingerprint };
}

export async function signInWithEmail(email: string, password: string, request: NextRequest): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.password) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  await ActivityLogger.log(user.id, 'email_login', request);
  const { accessToken, refreshToken } = JWTUtils.generateTokenPair({ userId: user.id });
  const { sessionToken, deviceFingerprint } = await SessionManager.createSession(user.id, request, 'email');
  return { user, accessToken, refreshToken, sessionToken, deviceFingerprint };
}
