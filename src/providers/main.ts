import type { NextRequest } from 'next/server';
import { BCRYPT_ROUNDS } from '@/config/env';
import { prisma } from '@/lib';
import { SecurityUtils } from '@/lib/auth';
import { ActivityLogger } from '@/utils';
import { getGoogleUserData } from './google';
import { getFacebookUserData } from './facebook';
import { signUpWithEmail } from './email';
import { handleOAuthLogin } from './handler';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export class AuthProviderHandler {
  static getGoogleUserData = getGoogleUserData;
  static getFacebookUserData = getFacebookUserData;
  static signUpWithEmail = signUpWithEmail;
  static handleOAuthLogin = handleOAuthLogin;
}

export class PasswordResetManager {
  static async initiateReset(email: string, request: NextRequest): Promise<void> {
    const ip = SecurityUtils.extractIP(request);
    const rateLimit = SecurityUtils.checkRateLimit(`reset:${ip}`, 3, 60 * 60 * 1000); // 3 per hour
    if (!rateLimit.allowed) {
      throw new Error(`Too many password reset attempts. Try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.`);
    }
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
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
