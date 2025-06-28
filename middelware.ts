import { verifyToken } from '@/utils/jwt'
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

// import { prisma } from '@/lib/prisma'
// import { NextRequest, NextResponse } from 'next/server'

// const SESSION_COOKIE = 'session'

// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*'],
// }

// export async function middleware(req: NextRequest) {
//   const sessionId = req.cookies.get(SESSION_COOKIE)?.value
//   if (!sessionId) return redirectToLogin(req)

//   const session = await prisma.session.findUnique({
//     where: { id: sessionId },
//     include: { user: true },
//   })

//   if (!session || new Date(session.expiresAt) < new Date())
//     return redirectToLogin(req)

//   return NextResponse.next()
// }

// function redirectToLogin(req: NextRequest) {
//   return NextResponse.redirect(new URL('/login', req.url))
// }
