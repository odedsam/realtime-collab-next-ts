import { prisma } from '@/lib';
import { JWTUtils } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const user = token ? (JWTUtils.verify(token) as { id: string }) : null;
  if (!user) return NextResponse.json([], { status: 200 });

  const docs = await prisma.document.findMany({
    where: { ownerId: user.id },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(docs);
}
