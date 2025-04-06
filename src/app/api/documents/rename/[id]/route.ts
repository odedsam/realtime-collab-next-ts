import { prisma } from 'app/lib/db'
import { verifyToken } from 'app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value
  const user = token ? verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title } = await req.json()

  const doc = await prisma.document.update({
    where: { id: params.id },
    data: { title },
  })

  return NextResponse.json(doc)
}
