import { prisma } from '@/app/lib/db'
import { verifyToken } from '@/app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = context
    const token = req.cookies.get('token')?.value
    const user = token ? verifyToken(token) : null

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
    })

    if (!doc) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    if (!doc.isPublic && doc.userId !== user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      isPublic: doc.isPublic,
    })
  } catch (error) {
    console.error('GET_DOC_ERROR', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { params } = context
    const token = req.cookies.get('token')?.value
    const user = token ? verifyToken(token) : null

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, isPublic } = body

    const existing = await prisma.document.findUnique({
      where: { id: params.id },
    })

    if (!existing || existing.userId !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updated = await prisma.document.update({
      where: { id: params.id },
      data: {
        title: title ?? undefined,
        content: content ?? undefined,
        isPublic: isPublic ?? undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH_DOC_ERROR', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
