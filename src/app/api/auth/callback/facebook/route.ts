import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AuthProviderHandler } from '@/providers/main';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    if (!code) throw new Error('Missing code parameter');

    const authResponse = await AuthProviderHandler.getFacebookUserData(code, request);

    if (!authResponse || !authResponse.user || !authResponse.user.id || !authResponse.user.email) {
      throw new Error('Invalid user data received from Facebook');
    }

    const user = authResponse.user;

    const result = await AuthProviderHandler.handleOAuthLogin(
      'facebook',
      user.id ?? null,
      user.email ?? null,
      user.name ?? null,
      user.avatar ?? null,
      request,
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Facebook OAuth failed' }, { status: 400 });
  }
}
