// Vanad aadressid elavad edasi: enne platvormi elas äpp aadressil
// /et/... ja /en/... — inimeste järjehoidjad ja jagatud lingid
// suunatakse ILS-i sündmuse alla, mitte ei anta 404.
import { NextResponse } from 'next/server';

const LEGACY_EVENT = 'ils-2026';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/et' || pathname === '/en'
      || pathname.startsWith('/et/') || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone();
    url.pathname = `/${LEGACY_EVENT}${pathname}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/et', '/et/:path*', '/en', '/en/:path*']
};
