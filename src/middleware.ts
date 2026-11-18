/**
 * Next.js Middleware
 * Provides security headers, rate limiting, and route protection structure.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimit, getClientIP } from './lib/security'

// Routes that should be protected (add admin routes here when you build them)
const PROTECTED_ROUTES = ['/admin']

// Public routes that don't need protection
const PUBLIC_ROUTES = ['/', '/api/contact']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request.headers)

  // -------------------------------------------------------------------------
  // 1. Security headers on every response
  // -------------------------------------------------------------------------
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
  )
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload',
  )

  // -------------------------------------------------------------------------
  // 2. Rate limiting for API routes
  // -------------------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    const { allowed, remaining, resetTime } = rateLimit(ip, 10, 60_000)

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', resetTime.toString())
  }

  // -------------------------------------------------------------------------
  // 3. Protected route guard (structure ready for auth)
  // -------------------------------------------------------------------------
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    // TODO: Add session verification here when you add authentication
    // Example:
    // const session = await getSession(request)
    // if (!session) return NextResponse.redirect(new URL('/login', request.url))

    // For now, block access to admin routes until auth is implemented
    return new NextResponse(
      JSON.stringify({ error: 'Admin area not yet configured' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
