import { prisma } from '@/lib';
import { JWTUtils } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    const user = token ? (JWTUtils.verify(token) as { id: string }) : null;

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        content: true,
        visibility: true,
        ownerId: true,
      },
    });

    if (!doc) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const isOwner = user?.id === doc.ownerId;

    if (doc.visibility !== 'PUBLIC' && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { ownerId, ...publicDoc } = doc; // exclude ownerId from response

    return NextResponse.json(publicDoc);
  } catch (error) {
    console.error('GET_DOC_ERROR', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value;
    const user = token ? (JWTUtils.verify(token) as { id: string }) : null;

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, content, visibility } = body;

    if (
      title !== undefined &&
      typeof title !== 'string' &&
      title !== null
    ) {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }
    if (
      content !== undefined &&
      typeof content !== 'string' &&
      content !== null
    ) {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
    }
    if (
      visibility !== undefined &&
      !['PUBLIC', 'PRIVATE', 'UNLISTED'].includes(visibility)
    ) {
      return NextResponse.json({ error: 'Invalid visibility' }, { status: 400 });
    }

    const existing = await prisma.document.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!existing) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    if (existing.ownerId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.document.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(visibility !== undefined ? { visibility } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH_DOC_ERROR', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
