import { prisma } from '@/lib';
import { JWTUtils } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  const user = token ? (JWTUtils.verify(token) as { id: string }) : null;
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    select: { ownerId: true },
  });

  if (!document) return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  if (document.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.document.delete({ where: { id: params.id } });

  return NextResponse.json({ message: 'Deleted' });
}
