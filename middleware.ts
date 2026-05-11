import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // We use a session cookie set by the client after Firebase Auth login.
  // The actual role validation happens client-side after hydration.
  // Middleware only enforces that a session token cookie exists.
  const sessionToken = request.cookies.get('gt_session')?.value

  const isAdminRoute = pathname.startsWith('/admin')
  const isEmployeeRoute = pathname.startsWith('/employee')
  const isProtectedRoute = isAdminRoute || isEmployeeRoute

  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/employee/:path*'],
}
