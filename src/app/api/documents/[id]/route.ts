import { prisma } from '@/app/lib/db'
import { verifyToken } from '@/app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('token')?.value
    const user = token ? verifyToken(token) : null

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
    })

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
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
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
