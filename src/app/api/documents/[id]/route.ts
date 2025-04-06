import { prisma } from 'app/lib/db'
import { verifyToken } from 'app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get('token')?.value
    const user = token ? verifyToken(token) : null
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const doc = await prisma.document.findUnique({
      where: { id: params.id },
    })

    if (!doc) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    }

    return NextResponse.json({ content: doc.content, title: doc.title })
  } catch (err) {
    console.error('GET_DOC_ERROR', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
