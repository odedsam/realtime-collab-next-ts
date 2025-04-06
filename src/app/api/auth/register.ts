import { prisma } from '@/app/lib/db'
import { hashPassword } from '@/app/utils/hash'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    }

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    })

    return NextResponse.json({ message: 'Registered successfully', userId: user.id })
  } catch (err) {
    console.error('REGISTER_ERROR', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
