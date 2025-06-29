import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.FACEBOOK_CLIENT_ID!;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI!;
  const scope = 'email public_profile';
  const responseType = 'code';
  const authUrl = new URL('https://www.facebook.com/v16.0/dialog/oauth');

  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('response_type', responseType);
  authUrl.searchParams.set('auth_type', 'rerequest');

  return NextResponse.redirect(authUrl.toString());
}
