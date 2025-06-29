import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { signUpWithEmail } from '@/providers/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await signUpWithEmail(email, password, request);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
