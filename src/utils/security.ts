
import {
  BCRYPT_ROUNDS,
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET,
} from '@/config/env';
import type { NextRequest } from 'next/server';
import type { UserPayload } from '@/types/auth';
import { SecurityUtils } from '@/lib/auth';
import { prisma } from '@/lib';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { ActivityLogger } from '@/utils';

export class JWTUtils {
  static sign(userId: string): string {
    const secret = JWT_SECRET as string;
    const payload: UserPayload = { userId };
    const options: SignOptions = { expiresIn: '7d' };
    return jwt.sign(payload, secret, options);
  }

  static signRefresh(payload: object): string {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: '30d' });
  }

  static verify(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET!);
    } catch (error) {
      return null;
    }
  }

  static decode(token: string): any {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  static generateTokenPair(payload: UserPayload): { accessToken: string; refreshToken: string } {
    const accessToken = this.sign(payload.userId); // Short-lived access token
    const refreshToken = this.signRefresh({ userId: payload.userId });

    return { accessToken, refreshToken };
  }
}

// OAuth providers handler class (renamed to avoid conflict)
export class OAuthProviderHandler {
  static async getGoogleUserData(code: string): Promise<any> {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error('Google OAuth not configured');
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/google',
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Google token exchange failed: ${tokenResponse.statusText}`);
      }

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        throw new Error('Failed to get Google access token');
      }

      // Get user data
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userResponse.ok) {
        throw new Error(`Google user info fetch failed: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.picture,
        verified: userData.verified_email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: tokens.expires_in,
      };
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }

  static async getFacebookUserData(code: string): Promise<any> {
    if (!FACEBOOK_CLIENT_ID || !FACEBOOK_CLIENT_SECRET) {
      throw new Error('Facebook OAuth not configured');
    }

    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: FACEBOOK_CLIENT_ID,
          client_secret: FACEBOOK_CLIENT_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/facebook',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error(`Facebook token exchange failed: ${tokenResponse.statusText}`);
      }

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        throw new Error('Failed to get Facebook access token');
      }

      // Get user data
      const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`);

      if (!userResponse.ok) {
        throw new Error(`Facebook user info fetch failed: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();

      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.picture?.data?.url,
        verified: true, // Facebook emails are generally verified
        accessToken: tokens.access_token,
        expiresIn: tokens.expires_in,
      };
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      throw new Error('Failed to authenticate with Facebook');
    }
  }
}

// Enhanced session management
export class SessionManager {
  static async createSession(
    userId: string,
    request: NextRequest,
    loginMethod: string = 'email',
  ): Promise<{ sessionToken: string; deviceFingerprint: string }> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const ip = SecurityUtils.extractIP(request);
    const userAgent = SecurityUtils.sanitizeUserAgent(request.headers.get('user-agent') || undefined);
    const acceptLanguage = request.headers.get('accept-language') || '';

    const deviceFingerprint = SecurityUtils.createDeviceFingerprint(userAgent || '', acceptLanguage, ip);

    await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
        ipAddress: SecurityUtils.hashIP(ip),
        userAgent,
      },
    });

    return { sessionToken, deviceFingerprint };
  }

  static async validateSession(sessionToken: string): Promise<{
    userId: string;
    user: any;
    session: any;
  } | null> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
              role: true,
              emailVerified: true,
              isOnline: true,
              lastActiveAt: true,
              createdAt: true,
            },
          },
        },
      });

      if (!session || !session.isActive || session.expires < new Date()) {
        if (session) {
          await prisma.session.update({
            where: { id: session.id },
            data: { isActive: false },
          });
        }
        return null;
      }

      // Update last activity
      await prisma.user.update({
        where: { id: session.userId },
        data: {
          lastActiveAt: new Date(),
          isOnline: true,
        },
      });

      return {
        userId: session.userId,
        user: session.user,
        session: {
          id: session.id,
          createdAt: session.createdAt,
        },
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  static async revokeSession(sessionToken: string): Promise<void> {
    await prisma.session.updateMany({
      where: { sessionToken },
      data: { isActive: false },
    });
  }

  static async revokeAllUserSessions(userId: string, exceptSessionToken?: string): Promise<void> {
    const where: any = { userId };
    if (exceptSessionToken) {
      where.sessionToken = { not: exceptSessionToken };
    }

    await prisma.session.updateMany({
      where,
      data: { isActive: false },
    });
  }

  static async getUserSessions(userId: string): Promise<any[]> {
    return prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        expires: { gt: new Date() },
      },
      select: {
        id: true,
        sessionToken: true,
        createdAt: true,
        isActive: true,
        ipAddress: true,
        userAgent: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async cleanupExpiredSessions(): Promise<void> {
    await prisma.session.updateMany({
      where: {
        OR: [{ expires: { lt: new Date() } }],
      },
      data: { isActive: false },
    });
  }
}

// Enhanced activity logging

// Password reset utilities
export class PasswordResetManager {
  static async initiateReset(email: string, request: NextRequest): Promise<void> {
    const ip = SecurityUtils.extractIP(request);

    // Rate limiting for password reset requests
    const rateLimit = SecurityUtils.checkRateLimit(`reset:${ip}`, 3, 60 * 60 * 1000); // 3 per hour
    if (!rateLimit.allowed) {
      throw new Error(`Too many password reset attempts. Try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.`);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiration: resetExpires,
      },
    });

    await ActivityLogger.log(user.id, 'password_reset_requested', request, undefined, { email });

    // TODO: Send email with reset token
    // await sendPasswordResetEmail(user.email, resetToken);
  }

  static async confirmReset(token: string, newPassword: string, request: NextRequest): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiration: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Validate password strength
    const passwordStrength = SecurityUtils.analyzePasswordStrength(newPassword);
    if (!passwordStrength.isStrong) {
      throw new Error(`Password is too weak. ${passwordStrength.feedback.join(', ')}`);
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await prisma.$transaction(async (tx) => {
      // Update password and clear reset token
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiration: null,
        },
      });

      // Revoke all existing sessions for security
      await tx.session.updateMany({
        where: { userId: user.id },
        data: { isActive: false },
      });
    });

    await ActivityLogger.log(user.id, 'password_reset_completed', request);
  }
}

// Main authentication service
