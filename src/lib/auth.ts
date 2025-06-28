import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'
import { signToken } from '../utils/jwt'
import { comparePassword } from '../utils/hash'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password)

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ userId: user.id })

    const response = NextResponse.json({ message: 'Logged in' })

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (err) {
    console.error('LOGIN_ERROR', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
