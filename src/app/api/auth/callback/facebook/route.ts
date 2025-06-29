import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
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

    const result = await AuthProviderHandler.handleOAuthLogin(
      'facebook',
      authResponse.user.id,
      authResponse.user.email,
      authResponse.user.name,
      authResponse.user.avatar,
      request,
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Facebook OAuth failed' }, { status: 400 });
  }
}
