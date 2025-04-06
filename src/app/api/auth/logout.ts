import { NextRequest, NextResponse } from 'next/server'

export async function POST(_: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out' })
  res.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  })
  return res
}
