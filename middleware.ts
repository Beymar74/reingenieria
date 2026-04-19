import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('jans_token')?.value;
  const isAuth = token && verifyToken(token);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard') && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (pathname === '/login' && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
