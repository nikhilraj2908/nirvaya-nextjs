import { NextResponse } from 'next/server';

export function middleware(request) {
  const isPreview =
    process.env.PREVIEW_MODE === 'true' || process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

  // If preview mode is false or unset, allow all routes normally
  if (!isPreview) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // 1. Home page is always allowed
  if (pathname === '/' || pathname === '') {
    return NextResponse.next();
  }

  // 2. Never intercept Next.js internals, Turbopack HMR, WebSockets, or dev server endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/__') ||
    pathname.startsWith('/_error')
  ) {
    return NextResponse.next();
  }

  // 3. Never redirect static files, media, or any file with an extension
  if (
    pathname.includes('.') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/videos') ||
    pathname.startsWith('/icons')
  ) {
    return NextResponse.next();
  }

  // 4. API routes: allow public API queries so UI data doesn't break; block admin with 403 JSON
  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/admin') || pathname.startsWith('/api/staff') || pathname.startsWith('/api/roles')) {
      return NextResponse.json(
        { error: 'Preview mode – admin access disabled' },
        { status: 403 }
      );
    }
    return NextResponse.next();
  }

  // 5. In Client Preview Mode, redirect all other page routes (/about, /doctors, /admin, etc.) to "/"
  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next (Next.js internals & HMR)
     * - __ (Turbopack dev server HMR & endpoints)
     * - assets, images, fonts, videos
     * - favicon.ico, sitemap.xml, robots.txt, site.webmanifest
     */
    '/((?!api|_next|__|assets|images|fonts|videos|favicon\\.ico|robots\\.txt|sitemap\\.xml|site\\.webmanifest).*)',
  ],
};
