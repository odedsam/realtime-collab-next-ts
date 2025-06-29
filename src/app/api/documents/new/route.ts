import { prisma } from '@/lib';
import { JWTUtils } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const user = token ? (JWTUtils.verify(token) as { id: string }) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const doc = await prisma.document.create({
    data: {
      title: 'Untitled',
      content: '',
      ownerId: user.id,
    },
    select: { id: true },
  });

  return NextResponse.json(doc);
}
