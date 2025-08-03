// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';
import { signUpWithEmail } from '@/providers/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, remember } = body;

    if (!email || !password || !name)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const user = await signUpWithEmail(name, email, password);

    const expiresAt = remember
      ? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 // 30 ימים
      : Math.floor(Date.now() / 1000) + 60 * 60;          // 1 שעה

    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'credentials',
        provider: 'email',
        providerAccountId: user.email,
        expires_at: expiresAt,
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
