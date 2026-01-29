import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req })

  const isAuthPage =
    pathname === '/' ||
    pathname === '/register' ||
    pathname.startsWith('/auth')

  const isProtectedRoute =
    pathname === '/messages' ||
    pathname.startsWith('/messages/')

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/messages', req.url))
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/register',
    '/auth/:path*',
    '/messages/:path*',
  ],
}
