import { prisma } from '@/lib';
import { JWTUtils } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';
import type { DocumentVisibility } from '@/types';

const VALID_VISIBILITIES: DocumentVisibility[] = ['PRIVATE', 'PUBLIC', 'TEAM'];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  const user = token ? (JWTUtils.verify(token) as { id: string }) : null;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { visibility } = await req.json();

  if (!VALID_VISIBILITIES.includes(visibility)) {
    return NextResponse.json({ error: 'Invalid visibility value' }, { status: 400 });
  }

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    select: { id: true, ownerId: true },
  });

  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  if (document.ownerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await prisma.document.update({
    where: { id: params.id },
    data: { visibility },
    select: { id: true, visibility: true },
  });

  return NextResponse.json(updated);
}
