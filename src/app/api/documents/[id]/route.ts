import { prisma } from '@/lib';
import { JWTUtils } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    const user = token ? (JWTUtils.verify(token) as { id: string }) : null;

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!doc) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const isOwner = doc.ownerId === user?.id;

    if (doc.visibility !== 'PUBLIC' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      visibility: doc.visibility,
    });
  } catch (err) {
    console.error('GET_DOC_ERROR', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value;
    const user = token ? (JWTUtils.verify(token) as { id: string }) : null;

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, content, visibility } = body;

    const existing = await prisma.document.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!existing) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    if (existing.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.document.update({
      where: { id: params.id },
      data: {
        title: title ?? undefined,
        content: content ?? undefined,
        visibility: visibility ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('PATCH_DOC_ERROR', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
