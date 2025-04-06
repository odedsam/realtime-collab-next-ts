import { prisma } from 'app/lib/db'
import { verifyToken } from 'app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const token = _.cookies.get('token')?.value
  const user = token ? verifyToken(token) : null
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.document.delete({
    where: { id: params.id },
  })

  return NextResponse.json({ message: 'Deleted' })
}
