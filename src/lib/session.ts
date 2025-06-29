import type { NextRequest } from 'next/server';
import { SecurityUtils } from './auth';
import { prisma } from '@/lib';
import crypto from 'crypto';

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
