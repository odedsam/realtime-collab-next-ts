import { NextResponse } from 'next/server';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const redirectUri = process.env.GOOGLE_REDIRECT_URI!;
const scope = encodeURIComponent('openid email profile');
const responseType = 'code';
const accessType = 'offline';
const prompt = 'consent';

export async function GET() {
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=${responseType}&` +
    `scope=${scope}&` +
    `access_type=${accessType}&` +
    `prompt=${prompt}`;

  return NextResponse.redirect(url);
}
