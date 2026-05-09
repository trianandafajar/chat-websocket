import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  console.log('token:', token);
  

  const isAuthPage =
    pathname === "/register" ||
    pathname.startsWith("/auth")

  const isProtectedRoute =
    pathname === "/messages" ||
    pathname.startsWith("/messages/")

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/messages", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/register",
    "/auth/:path*",
    "/messages/:path*",
  ],
}
