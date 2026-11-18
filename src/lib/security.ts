/**
 * Security utilities for Rahat's Portfolio
 * Input validation, sanitization, rate limiting, and CORS helpers
 */

import { z } from 'zod'

// ---------------------------------------------------------------------------
// 1. Input validation schemas
// ---------------------------------------------------------------------------

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

// ---------------------------------------------------------------------------
// 2. Input sanitization (XSS protection)
// ---------------------------------------------------------------------------

/**
 * Strip HTML tags and encode dangerous characters to prevent XSS.
 * Safe for rendering user-submitted text in React.
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize a contact form submission before storing/displaying.
 */
export function sanitizeContactForm(data: ContactFormInput): ContactFormInput {
  return {
    name: sanitizeHtml(data.name),
    email: sanitizeHtml(data.email),
    message: sanitizeHtml(data.message),
  }
}

// ---------------------------------------------------------------------------
// 3. Rate limiting (in-memory store)
// ---------------------------------------------------------------------------
// NOTE: For production on Vercel, replace this with Upstash Redis or
// Vercel's built-in rate limiting. In-memory resets on each serverless
// invocation, so it's best-effort on serverless platforms.

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Simple fixed-window rate limiter.
 * @param key - Unique identifier (IP address, user ID, etc.)
 * @param limit - Max requests per window
 * @param windowMs - Window size in milliseconds
 * @returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, resetTime: entry.resetTime }
}

// ---------------------------------------------------------------------------
// 4. CORS helpers
// ---------------------------------------------------------------------------

const ALLOWED_ORIGINS = [
  'https://rahat-portfolio.vercel.app',
  'http://localhost:3000',
]

export function getCorsHeaders(origin?: string | null) {
  const isAllowed = origin ? ALLOWED_ORIGINS.includes(origin) : false
  const allowOrigin = isAllowed ? origin : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

// ---------------------------------------------------------------------------
// 5. IP extraction helper
// ---------------------------------------------------------------------------

export function getClientIP(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  const realIp = headers.get('x-real-ip')
  const cfConnectingIp = headers.get('cf-connecting-ip')

  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}
