import type { NextRequest } from 'next/server';
import type { AuthResponse } from '@/types/auth';
import { prisma } from '@/lib';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/config/env';
import { JWTUtils } from '@/utils/jwt';
import { SessionManager } from '@/lib/session';
import { ActivityLogger } from '@/utils';


export async function getGoogleUserData(code: string, request: NextRequest): Promise<AuthResponse> {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  const userData = await userInfoResponse.json();
  const provider = 'google';
  const providerAccountId = userData.id;

  let account = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    include: { user: true },
  });

  let user = account?.user;

  if (!user) {
    const foundUser = await prisma.user.findUnique({ where: { email: userData.email.toLowerCase() } });
    user = foundUser ?? undefined;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email.toLowerCase(),
          name: userData.name,
          avatar: userData.picture,
          emailVerified: userData.verified_email,
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
        scope: tokens.scope,
        id_token: tokens.id_token,
      },
    });
  }

  await ActivityLogger.log(user.id, 'oauth_google_login', request);
  const { accessToken, refreshToken } = JWTUtils.generateTokenPair({ userId: user.id });
  const { sessionToken, deviceFingerprint } = await SessionManager.createSession(user.id, request, 'google');

  return { user, accessToken, refreshToken, sessionToken, deviceFingerprint };
}
