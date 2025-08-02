import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret });

    if (!token) {
      const url = new URL(`/`, req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url)); 
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], 
};