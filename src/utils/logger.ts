import type { NextRequest } from 'next/server';
import { SecurityUtils } from '@/lib/auth';
import { prisma } from '@/lib';

export class ActivityLogger {
  static async log(userId: string, action: string, request: NextRequest, documentId?: string, details?: object): Promise<void> {
    try {
      const ip = SecurityUtils.extractIP(request);
      const userAgent = SecurityUtils.sanitizeUserAgent(request.headers.get('user-agent') || undefined);

      await prisma.activity.create({
        data: {
          userId,
          action,
          documentId,
          details: details ? JSON.stringify(details) : null,
          ipAddress: SecurityUtils.hashIP(ip),
          userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
      // Don't throw - logging failures shouldn't break the app
    }
  }

  static async getRecentActivity(userId: string, limit: number = 10): Promise<any[]> {
    return prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        action: true,
        createdAt: true,
        details: true,
        document: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  static async getActivityStats(userId: string, days: number = 30): Promise<any> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const activities = await prisma.activity.findMany({
      where: {
        userId,
        createdAt: { gte: startDate },
      },
    });

    const stats = activities.reduce(
      (acc, activity) => {
        acc[activity.action] = (acc[activity.action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: activities.length,
      breakdown: stats,
      period: `${days} days`,
    };
  }
}
