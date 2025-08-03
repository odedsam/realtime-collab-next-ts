import { NextResponse } from 'next/server';
import { signInWithEmail } from '@/providers/email';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    const result = await signInWithEmail(name ,email, password, request);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
