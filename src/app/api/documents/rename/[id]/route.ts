import { prisma } from '@/lib';
import { JWTUtils } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  const user = token ? (JWTUtils.verify(token) as { id: string }) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title } = await req.json();
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
  }

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    select: { ownerId: true },
  });

  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if (document.ownerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await prisma.document.update({
    where: { id: params.id },
    data: {
      title,
      lastEditedAt: new Date(),
    },
    select: { id: true, title: true },
  });

  return NextResponse.json(updated);
}
