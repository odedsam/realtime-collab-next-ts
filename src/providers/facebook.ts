import { prisma } from '@/lib';
import { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } from '@/config/env';
import { JWTUtils } from '@/utils/jwt';
import { SessionManager } from '@/lib/session';
import { ActivityLogger } from '@/utils';
import type { NextRequest } from 'next/server';
import type { AuthResponse } from '@/types/auth';

export async function getFacebookUserData(code: string, request: NextRequest): Promise<AuthResponse> {
  const tokenRes = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: FACEBOOK_CLIENT_ID!,
      client_secret: FACEBOOK_CLIENT_SECRET!,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
    }),
  });

  const tokens = await tokenRes.json();

  const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`);
  const userData = await userRes.json();

  const provider = 'facebook';
  const providerAccountId = userData.id;

  let account = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  });

  let user = account?.user;

  if (!user) {
    const foundUser = await prisma.user.findUnique({ where: { email: userData.email.toLowerCase() } });
    user = foundUser === null ? undefined : foundUser;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase(),
          name: userData.name,
          avatar: userData.picture?.data?.url,
          emailVerified: true,
        },
      });
    }

    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider,
        providerAccountId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : undefined,
        token_type: tokens.token_type,
      },
    });
  }

  await ActivityLogger.log(user.id, 'oauth_facebook_login', request);

  const { accessToken, refreshToken } = JWTUtils.generateTokenPair({ userId: user.id });
  const { sessionToken, deviceFingerprint } = await SessionManager.createSession(user.id, request, 'facebook');

  return { user, accessToken, refreshToken, sessionToken, deviceFingerprint };
}
