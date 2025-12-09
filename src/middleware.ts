import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intl = createMiddleware({
  locales: ['en', 'sr'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const res = intl(req);
  if (pathname.startsWith('/en/auth') || pathname.startsWith('/sr/auth') || pathname === '/') {
    return res;
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    const locale = pathname.startsWith('/sr') ? 'sr' : 'en';
    url.pathname = `/${locale}/auth/login`;
    url.searchParams.set('next', pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return res;
}

export const config = {
  matcher: ['/', '/(en|sr)/:path*'],
};
