import { prisma } from 'app/lib/db'
import { verifyToken } from 'app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    const user = token ? verifyToken(token) : null
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { content, title, id } = await req.json()

    if (!content || !title) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const doc = await prisma.document.upsert({
      where: { id },
      update: { content, title },
      create: {
        content,
        title,
        userId: user.userId,
      },
    })

    return NextResponse.json({ id: doc.id })
  } catch (err) {
    console.error('SAVE_DOC_ERROR', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
