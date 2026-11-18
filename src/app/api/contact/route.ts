/**
 * Secured Contact API Endpoint
 *
 * Features:
 * - Input validation with Zod
 * - XSS sanitization
 * - Rate limiting
 * - CORS headers
 * - Honeypot field (bot trap)
 * - Structured error responses
 * - No sensitive data logged
 */

import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema, sanitizeContactForm, rateLimit, getClientIP, getCorsHeaders } from '../../../lib/security'

// Honeypot field name - bots fill this, humans don't
const HONEYPOT_FIELD = 'website'

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  const ip = getClientIP(request.headers)

  // -------------------------------------------------------------------------
  // 1. Rate limiting
  // -------------------------------------------------------------------------
  const { allowed, remaining, resetTime } = rateLimit(ip, 5, 60_000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...getCorsHeaders(origin),
          'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
        },
      },
    )
  }

  try {
    // -------------------------------------------------------------------------
    // 2. Parse body
    // -------------------------------------------------------------------------
    const body = await request.json()

    // -------------------------------------------------------------------------
    // 3. Honeypot check (if filled, it's a bot)
    // -------------------------------------------------------------------------
    if (body[HONEYPOT_FIELD] && String(body[HONEYPOT_FIELD]).trim() !== '') {
      // Silently accept but don't process - fool the bot
      return NextResponse.json({ message: 'Message received' }, {
        status: 200,
        headers: getCorsHeaders(origin),
      })
    }

    // -------------------------------------------------------------------------
    // 4. Validate input
    // -------------------------------------------------------------------------
    const validation = contactFormSchema.safeParse({
      name: body.name,
      email: body.email,
      message: body.message,
    })

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validation.error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        {
          status: 400,
          headers: getCorsHeaders(origin),
        },
      )
    }

    // -------------------------------------------------------------------------
    // 5. Sanitize (XSS protection)
    // -------------------------------------------------------------------------
    const sanitized = sanitizeContactForm(validation.data)

    // -------------------------------------------------------------------------
    // 6. Process (TODO: connect email service here)
    // -------------------------------------------------------------------------
    // Example:
    // await resend.emails.send({...})
    // await db.contactMessages.create({...})
    //
    // For now, we just acknowledge receipt.

    return NextResponse.json(
      {
        message: 'Message received successfully',
        id: `msg_${Date.now()}`,
      },
      {
        status: 200,
        headers: {
          ...getCorsHeaders(origin),
          'X-RateLimit-Remaining': remaining.toString(),
        },
      },
    )
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      {
        status: 500,
        headers: getCorsHeaders(origin),
      },
    )
  }
}

// Explicitly disallow other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
