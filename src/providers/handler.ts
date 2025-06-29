import { SessionManager } from '@/lib';
import { AuthResponse } from '@/types';
import { ActivityLogger, JWTUtils } from '@/utils';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib';

export async function handleOAuthLogin(
  provider: string,
  providerId: string,
  email: string | null,
  name: string | null,
  avatar: string | null,
  request: NextRequest,
): Promise<AuthResponse> {
  if (!email) throw new Error('OAuth provider did not return email');

  let account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId: providerId,
      },
    },
    include: { user: true },
  });

  let user = account?.user ?? null;

  if (!user) {
    user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          name,
          avatar,
          emailVerified: true,
        },
      });
    }

    account = await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider,
        providerAccountId: providerId,
        access_token: null,
        refresh_token: null,
      },
      include: { user: true },
    });
  }

  await ActivityLogger.log(user.id, `${provider}_login`, request);

  const { accessToken, refreshToken } = JWTUtils.generateTokenPair({ userId: user.id });
  const { sessionToken, deviceFingerprint } = await SessionManager.createSession(user.id, request, provider);

  return { user, accessToken, refreshToken, sessionToken, deviceFingerprint };
}
