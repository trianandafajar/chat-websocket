import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function hasSessionCookie(req: NextRequest) {
  const s1 = req.cookies.get('next-auth.session-token')?.value;
  const s2 = req.cookies.get('__Secure-next-auth.session-token')?.value;
  return !!(s1 || s2);
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === '/' || pathname === '/register' || pathname.startsWith('/auth');
  const isProtected = pathname === '/messages' || pathname.startsWith('/messages/');

  const hasSession = hasSessionCookie(req);

  // If logged in, prevent access to auth pages
  if (hasSession && isAuthPage) {
    url.pathname = '/messages';
    return NextResponse.redirect(url);
  }

  // If not logged in, protect messages
  if (!hasSession && isProtected) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/register', '/auth/:path*', '/messages'],
};
