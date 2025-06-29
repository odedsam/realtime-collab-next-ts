import type { SignUpSchema, ResetPasswordSchema, ConfirmResetPasswordSchema, RefreshTokenSchema, OAuthSchema } from '@/utils/schemas';
import type { NextRequest } from 'next/server';
import { AccountType, PrismaOAuthProvider } from '@/types/auth';
import { BCRYPT_ROUNDS } from '@/config/env';
import { prisma, SecurityUtils } from '@/lib';
import { JWTUtils, OAuthProviderHandler, PasswordResetManager, ActivityLogger } from '@/utils';
import { signUpSchema, signInSchema, oauthSchema, refreshTokenSchema, resetPasswordSchema, confirmResetSchema } from '@/utils/schemas';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { SessionManager } from '../session';

// Main authentication serviceƒ

export class AuthService {
  // Enhanced email signup
  static async signUp(
    data: SignUpSchema,
    request: NextRequest,
  ): Promise<{ user: any; tokens: { accessToken: string; refreshToken: string } }> {
    const validated = signUpSchema.parse(data);
    const ip = SecurityUtils.extractIP(request);

    // Enhanced rate limiting
    const rateLimit = SecurityUtils.checkRateLimit(`signup:${ip}`, 3, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      throw new Error(`Too many signup attempts. Try again in ${rateLimit.retryAfter} seconds.`);
    }

    // Password strength validation
    const passwordStrength = SecurityUtils.analyzePasswordStrength(validated.password);
    if (!passwordStrength.isStrong) {
      throw new Error(`Password is too weak. ${passwordStrength.feedback.join(', ')}`);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, BCRYPT_ROUNDS);

    // Create user and email account
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: validated.email,
          password: hashedPassword,
          name: validated.name,
          emailVerificationToken: crypto.randomBytes(32).toString('hex'),
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      });

      // Create email account record
      await tx.account.create({
        data: {
          userId: newUser.id,
          type: AccountType.EMAIL,
          provider: '',
          providerAccountId: '',
        },
      });

      return newUser;
    });

    // Create session
    const { sessionToken } = await SessionManager.createSession(user.id, request, 'email');

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair({
      userId: user.id,
      sessionToken,
      email: user.email,
      role: user.role,
    });

    // Log activity
    await ActivityLogger.log(user.id, 'user_signup', request, undefined, {
      method: 'email',
      passwordScore: passwordStrength.score,
    });

    return { user, tokens };
  }

  // Enhanced email signin
  static async signIn(
    data: SignUpSchema,
    request: NextRequest,
  ): Promise<{ user: any; tokens: { accessToken: string; refreshToken: string } }> {
    const validated = signInSchema.parse(data);
    const ip = SecurityUtils.extractIP(request);

    // Rate limiting
    const rateLimit = SecurityUtils.checkRateLimit(`signin:${ip}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      throw new Error(`Too many signin attempts. Try again in ${rateLimit.retryAfter} seconds.`);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validated.email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        password: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(validated.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update user status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActiveAt: new Date(),
        isOnline: true,
      },
    });

    // Create session
    const { sessionToken } = await SessionManager.createSession(user.id, request, 'email');

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair({
      userId: user.id,
      sessionToken,
      email: user.email,
      role: user.role,
    });

    // Log activity
    await ActivityLogger.log(user.id, 'user_signin', request);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  // OAuth signin/signup
  static async oauthSignIn(
    data: OAuthSchema,
    request: NextRequest,
  ): Promise<{
    user: any;
    tokens: { accessToken: string; refreshToken: string };
    isNewUser: boolean;
  }> {
    const validated = oauthSchema.parse(data);
    const ip = SecurityUtils.extractIP(request);

    // Rate limiting
    const rateLimit = SecurityUtils.checkRateLimit(`oauth:${ip}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      throw new Error(`Too many OAuth attempts. Try again in ${rateLimit.retryAfter} seconds.`);
    }

    let oauthData;
    let provider: PrismaOAuthProvider;

    // Get user data from OAuth provider
    switch (validated.provider) {
      case 'google':
        oauthData = await OAuthProviderHandler.getGoogleUserData(validated.code);
        provider = PrismaOAuthProvider.GOOGLE;
        break;
      case 'facebook':
        oauthData = await OAuthProviderHandler.getFacebookUserData(validated.code);
        provider = PrismaOAuthProvider.FACEBOOK;
        break;
      default:
        throw new Error('Unsupported OAuth provider');
    }

    if (!oauthData.email) {
      throw new Error('Email not provided by OAuth provider');
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: oauthData.email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    let isNewUser = false;

    if (!user) {
      // Create new user
      user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email: oauthData.email.toLowerCase(),
            name: oauthData.name,
            avatar: oauthData.avatar,
            emailVerified: oauthData.verified || true,
          },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            role: true,
            emailVerified: true,
            createdAt: true,
          },
        });

        // Create OAuth account
        await tx.account.create({
          data: {
            userId: newUser.id,
            type: AccountType.OAUTH,
            provider,
            providerAccountId: oauthData.id,
            access_token: oauthData.accessToken,
            refresh_token: oauthData.refreshToken,
            expires_at: oauthData.expiresIn ? Math.floor((Date.now() + oauthData.expiresIn * 1000) / 1000) : null,
          },
        });

        return newUser;
      });

      isNewUser = true;
    } else {
      // Update existing OAuth account or create new one
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId: oauthData.id,
          },
        },
        update: {
          access_token: oauthData.accessToken,
          refresh_token: oauthData.refreshToken,
          expires_at: oauthData.expiresIn ? Math.floor((Date.now() + oauthData.expiresIn * 1000) / 1000) : null,
        },
        create: {
          userId: user.id,
          type: AccountType.OAUTH,
          provider,
          providerAccountId: oauthData.id,
          access_token: oauthData.accessToken,
          refresh_token: oauthData.refreshToken,
          expires_at: oauthData.expiresIn ? Math.floor((Date.now() + oauthData.expiresIn * 1000) / 1000) : null,
        },
      });

      // Update user info if needed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name || oauthData.name,
          avatar: user.avatar || oauthData.avatar,
          emailVerified: user.emailVerified || oauthData.verified,
          lastActiveAt: new Date(),
          isOnline: true,
        },
      });
    }

    // Create session
    const { sessionToken } = await SessionManager.createSession(user.id, request, `oauth_${validated.provider}`);

    // Generate tokens
    const tokens = JWTUtils.generateTokenPair({
      userId: user.id,
      sessionToken,
      email: user.email,
      role: user.role,
    });

    // Log activity
    await ActivityLogger.log(user.id, isNewUser ? 'oauth_signup' : 'oauth_signin', request, undefined, {
      provider: validated.provider,
      isNewUser,
    });

    return { user, tokens, isNewUser };
  }

  // Refresh token endpoint
  static async refreshToken(data: RefreshTokenSchema, request: NextRequest): Promise<{ accessToken: string; refreshToken: string }> {
    const validated = refreshTokenSchema.parse(data);
    const ip = SecurityUtils.extractIP(request);

    // Rate limiting for token refresh
    const rateLimit = SecurityUtils.checkRateLimit(`refresh:${ip}`, 20, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      throw new Error(`Too many token refresh attempts. Try again in ${rateLimit.retryAfter} seconds.`);
    }

    // Verify refresh token
    const decoded = JWTUtils.verify(validated.refreshToken);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid refresh token');
    }

    // Validate user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isOnline: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate new token pair
    const tokens = JWTUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Update user activity
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    await ActivityLogger.log(user.id, 'token_refresh', request);

    return tokens;
  }

  // Password reset initiation
  static async initiatePasswordReset(data: ResetPasswordSchema, request: NextRequest): Promise<void> {
    const validated = resetPasswordSchema.parse(data);
    await PasswordResetManager.initiateReset(validated.email, request);
  }

  // Password reset confirmation
  static async confirmPasswordReset(data: ConfirmResetPasswordSchema, request: NextRequest): Promise<void> {
    const validated = confirmResetSchema.parse(data);
    await PasswordResetManager.confirmReset(validated.token, validated.password, request);
  }

  // Sign out
  static async signOut(sessionToken: string, request: NextRequest): Promise<void> {
    const session = await SessionManager.validateSession(sessionToken);
    if (session) {
      await SessionManager.revokeSession(sessionToken);
      // Update user status
      await prisma.user.update({
        where: { id: session.userId },
        data: { isOnline: false },
      });
      await ActivityLogger.log(session.userId, 'user_signout', request);
    }
  }

  // Sign out from all devices
  static async signOutAll(sessionToken: string, request: NextRequest): Promise<void> {
    const session = await SessionManager.validateSession(sessionToken);

    if (session) {
      await SessionManager.revokeAllUserSessions(session.userId);

      // Update user status
      await prisma.user.update({
        where: { id: session.userId },
        data: { isOnline: false },
      });

      await ActivityLogger.log(session.userId, 'user_signout_all', request);
    }
  }

  // Get current user
  static async getCurrentUser(sessionToken: string): Promise<any> {
    const session = await SessionManager.validateSession(sessionToken);
    return session ? session.user : null;
  }

  // Get user sessions
  static async getUserSessions(sessionToken: string): Promise<any[]> {
    const session = await SessionManager.validateSession(sessionToken);
    if (!session) {
      throw new Error('Invalid session');
    }

    return SessionManager.getUserSessions(session.userId);
  }

  // Revoke specific session
  static async revokeSession(currentSessionToken: string, targetSessionToken: string, request: NextRequest): Promise<void> {
    const session = await SessionManager.validateSession(currentSessionToken);
    if (!session) {
      throw new Error('Invalid session');
    }

    // Verify target session belongs to the same user
    const targetSession = await prisma.session.findUnique({
      where: { sessionToken: targetSessionToken },
    });

    if (!targetSession || targetSession.userId !== session.userId) {
      throw new Error('Session not found or unauthorized');
    }

    await SessionManager.revokeSession(targetSessionToken);
    await ActivityLogger.log(session.userId, 'session_revoked', request, undefined, {
      targetSessionId: targetSession.id,
    });
  }

  // Get user activity
  static async getUserActivity(sessionToken: string, limit: number = 10): Promise<any[]> {
    const session = await SessionManager.validateSession(sessionToken);
    if (!session) {
      throw new Error('Invalid session');
    }

    return ActivityLogger.getRecentActivity(session.userId, limit);
  }

  // Get activity statistics
  static async getActivityStats(sessionToken: string, days: number = 30): Promise<any> {
    const session = await SessionManager.validateSession(sessionToken);
    if (!session) {
      throw new Error('Invalid session');
    }

    return ActivityLogger.getActivityStats(session.userId, days);
  }

  // Validate session middleware
  static async validateSessionMiddleware(request: NextRequest): Promise<{
    isValid: boolean;
    user?: any;
    session?: any;
    error?: string;
  }> {
    try {
      const authHeader = request.headers.get('authorization');
      const sessionToken = request.cookies.get('session-token')?.value;

      let token: string | null = null;

      // Check Authorization header first
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const bearerToken = authHeader.substring(7);
        const decoded = JWTUtils.verify(bearerToken);
        if (decoded && decoded.sessionToken) {
          token = decoded.sessionToken;
        }
      }

      // Fallback to cookie
      if (!token && sessionToken) {
        token = sessionToken;
      }

      if (!token) {
        return { isValid: false, error: 'No authentication token provided' };
      }

      const session = await SessionManager.validateSession(token);
      if (!session) {
        return { isValid: false, error: 'Invalid or expired session' };
      }

      return {
        isValid: true,
        user: session.user,
        session: session.session,
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return { isValid: false, error: 'Session validation failed' };
    }
  }

  // Cleanup expired sessions and rate limits (should be called periodically)
  static async cleanup(): Promise<void> {
    try {
      await SessionManager.cleanupExpiredSessions();
      SecurityUtils.cleanupRateLimit();
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  // Email verification
  static async verifyEmail(token: string, request: NextRequest): Promise<void> {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new Error('Invalid verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date() as any,
        emailVerificationToken: null,
      },
    });

    await ActivityLogger.log(user.id, 'email_verified', request);
  }

  // Resend email verification
  static async resendEmailVerification(email: string, request: NextRequest): Promise<void> {
    const ip = SecurityUtils.extractIP(request);

    // Rate limiting
    const rateLimit = SecurityUtils.checkRateLimit(`verify:${ip}`, 3, 60 * 60 * 1000);
    if (!rateLimit.allowed) {
      throw new Error(`Too many verification attempts. Try again in ${Math.ceil(rateLimit.retryAfter! / 60)} minutes.`);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: verificationToken },
    });

    await ActivityLogger.log(user.id, 'verification_resent', request);

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, verificationToken);
  }
}
