import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/favicon.ico', '/logo.svg', '/logo.png', '/_next/', '/_static/', '/api/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('user_role')?.value;
  const loggedIn = request.cookies.get('user_logged_in')?.value === 'true';

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isVendorRoute = pathname.startsWith('/vendor');
  const isCustomerRoute = pathname.startsWith('/customer');

  if (!loggedIn && (isAdminRoute || isVendorRoute || isCustomerRoute)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (loggedIn) {
    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isVendorRoute && role !== 'VENDOR') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (isCustomerRoute && role !== 'CUSTOMER') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname === '/') {
      const destination =
        role === 'ADMIN'
          ? '/admin/dashboard'
          : role === 'VENDOR'
          ? '/vendor/dashboard'
          : '/customer/home';
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/vendor/:path*', '/customer/:path*', '/'],
};
