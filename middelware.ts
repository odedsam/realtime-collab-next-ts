import { verifyToken } from '@/app/utils/jwt'
import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isProtected = protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isProtected && token) {
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
