import { prisma } from '@/lib'
import { verifyToken } from '@/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value
  const user = token ? verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { isPublic } = await req.json()

  const updated = await prisma.document.update({
    where: { id: params.id },
    data: { isPublic },
  })

  return NextResponse.json({ id: updated.id, isPublic: updated.isPublic })
}
