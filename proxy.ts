import {NextRequest, NextResponse} from 'next/server';

// Mirrors what an i18n middleware does for a default locale with an
// "as-needed" prefix (default `en`, secondary `de`):
//
//   /     -> rewrite to /en   (default locale served without a prefix)
//   /en   -> redirect to /    (strip the redundant default-locale prefix)
//   /de   -> served as-is
export default function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (pathname === '/en') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/en', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico).*)'
};
