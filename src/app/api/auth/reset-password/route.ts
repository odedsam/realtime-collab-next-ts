import { NextRequest, NextResponse } from 'next/server';
import { PasswordResetManager } from '@/providers/main';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Missing token or password.' }, { status: 400 });
    }

    await PasswordResetManager.confirmReset(token, password, request);

    return NextResponse.json({ message: 'Password reset successful.', success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Password reset failed.', success: false }, { status: 400 });
  }
}
