import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Проверяем наличие токена для защищенных маршрутов
  const token = request.cookies.get('access_token')?.value

  console.log('Middleware:', {
    path: request.nextUrl.pathname,
    hasToken: !!token
  })

  // Защищенные маршруты
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('Middleware: Redirecting to login - no token')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}