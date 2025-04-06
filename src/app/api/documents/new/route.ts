import { prisma } from 'app/lib/db'
import { verifyToken } from 'app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const user = token ? verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const doc = await prisma.document.create({
    data: {
      title: 'Untitled',
      content: '',
      userId: user.userId,
    },
  })

  return NextResponse.json({ id: doc.id })
}
