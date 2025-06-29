import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'No session token found' }, { status: 401 });
    }

    await prisma.session.updateMany({
      where: { sessionToken, isActive: true },
      data: { isActive: false },
    });

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('sessionToken');

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Logout failed' }, { status: 500 });
  }
}
