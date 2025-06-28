import { prisma } from '@/lib'
import { verifyToken } from '@/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const user = token ? verifyToken(token) : null
  if (!user) return NextResponse.json([], { status: 200 })

  const docs = await prisma.document.findMany({
    where: { userId: user.userId },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(docs)
}
