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
