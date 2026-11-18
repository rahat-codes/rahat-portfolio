# Security Audit Report — Rahat Portfolio

**Date:** 2026-11-19  
**Scope:** Next.js 14 portfolio website (static + secured contact API)  
**Status:** ✅ Ready for production deployment

---

## 1. Environment Variables & Secrets

| Check | Status | Notes |
|-------|--------|-------|
| No hardcoded API keys | ✅ Pass | No API keys exist in source code |
| `.env.example` present | ✅ Pass | Template for required env vars |
| `.env.local` gitignored | ✅ Pass | Listed in `.gitignore` |
| `.gitignore` comprehensive | ✅ Pass | Covers env, node_modules, .next, IDE, OS |
| No secrets in git history | ✅ Pass | Fresh repo, no prior commits |

**Action:** Copy `.env.example` → `.env.local` before adding any secret values. Never commit `.env.local`.

---

## 2. Authentication & Authorization

| Check | Status | Notes |
|-------|--------|-------|
| No admin routes exposed | ✅ Pass | `/admin` returns 404 until auth is added |
| Middleware route protection | ✅ Pass | `src/middleware.ts` blocks protected routes |
| Auth structure ready | ✅ Pass | Middleware has TODO hook for session verification |

**Note:** No authentication system is currently installed. If you add an admin dashboard later, use NextAuth.js or Clerk and implement session verification in `src/middleware.ts`.

---

## 3. Input Validation & Sanitization

| Check | Status | Notes |
|-------|--------|-------|
| Zod validation schemas | ✅ Pass | `contactFormSchema` validates all fields |
| XSS sanitization | ✅ Pass | `sanitizeHtml()` escapes HTML entities |
| Honeypot bot trap | ✅ Pass | Hidden `website` field catches bots |
| Type-safe form handling | ✅ Pass | `ContactFormInput` type exported |

**Endpoint:** `POST /api/contact` validates, sanitizes, and rate-limits all submissions.

---

## 4. Rate Limiting

| Check | Status | Notes |
|-------|--------|-------|
| Per-IP rate limiting | ✅ Pass | `rateLimit()` in `src/lib/security.ts` |
| API route throttling | ✅ Pass | Middleware applies limits to `/api/*` |
| Contact form limit | ✅ Pass | 5 requests per minute per IP |
| Retry-After header | ✅ Pass | Returns reset time on 429 |

**Note:** In-memory rate limiter resets on serverless cold starts. For production high-traffic, replace with Upstash Redis.

---

## 5. API Endpoint Security

| Check | Status | Notes |
|-------|--------|-------|
| CORS restricted | ✅ Pass | Only `rahat-portfolio.vercel.app` allowed |
| Allowed methods only | ✅ Pass | POST and OPTIONS only; others return 405 |
| Structured error responses | ✅ Pass | No stack traces leaked to client |
| OPTIONS preflight handled | ✅ Pass | Returns 204 with CORS headers |

---

## 6. Security Headers

| Header | Value | Location |
|--------|-------|----------|
| `X-Frame-Options` | `DENY` | next.config.js + middleware |
| `X-Content-Type-Options` | `nosniff` | next.config.js + middleware |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | next.config.js + middleware |
| `Permissions-Policy` | Camera/mic/geo/etc. disabled | next.config.js + middleware |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | next.config.js + middleware |
| `Content-Security-Policy` | Restricted sources | next.config.js |
| `X-Powered-By` | Disabled | `poweredByHeader: false` |
| `Access-Control-Allow-Origin` | `https://rahat-portfolio.vercel.app` | next.config.js + API route |

---

## 7. Debug Mode

| Check | Status | Notes |
|-------|--------|-------|
| Next.js debug disabled | ✅ Pass | Production builds have no debug output |
| `NEXT_TELEMETRY_DISABLED` | ✅ Pass | Set in vercel.json |
| No `console.log` of secrets | ✅ Pass | No sensitive logging in code |

---

## 8. Dependency Management

| Check | Status | Notes |
|-------|--------|-------|
| `package.json` updated | ✅ Pass | Next.js 14.2.15, zod, latest deps |
| `npm audit` recommended | ⚠️ Pending | Run before each deployment |

**Action:** Run `npm audit` before deploying. Fix any `high` or `critical` vulnerabilities.

---

## 9. Exposed Files

| Check | Status | Notes |
|-------|--------|-------|
| `.vercelignore` present | ✅ Pass | Excludes env, docs, git, IDE files |
| `robots.txt` present | ✅ Pass | Allows crawling, no sensitive paths |
| `sitemap.xml` present | ✅ Pass | Public URLs only |
| No `/.env` exposure | ✅ Pass | `.env` files are gitignored |
| No `/.git` exposure | ✅ Pass | `.git` directory excluded from deploy |

---

## 10. Database & Passwords

| Check | Status | Notes |
|-------|--------|-------|
| No database | ✅ N/A | Static site; no database connected |
| No password storage | ✅ N/A | No user authentication system yet |

**Note:** If you add a database or user accounts later, use bcrypt/argon2 for password hashing and never store plaintext passwords.

---

## Deployment Checklist

Before deploying to Vercel:

1. [ ] Copy `.env.example` → `.env.local` (add any secrets)
2. [ ] Run `npm audit` — fix high/critical vulnerabilities
3. [ ] Commit all changes (`.env.local` must NOT be committed)
4. [ ] Push to GitHub
5. [ ] Import repo in Vercel dashboard
6. [ ] Verify build succeeds
7. [ ] Test contact form submission
8. [ ] Verify security headers with browser dev tools

---

## Contact for Security Issues

- **Email:** mhr1760@gmail.com
- **GitHub:** https://github.com/rahat-codes
