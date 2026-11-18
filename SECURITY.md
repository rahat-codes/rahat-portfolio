# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.0   | ✅        |

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities. Instead, contact:

- **Email:** mhr1760@gmail.com
- **GitHub:** https://github.com/rahat-codes

Include as much detail as possible so we can reproduce and fix the issue.

## Security Features

This portfolio implements the following security measures:

- **Content Security Policy (CSP)** - Restricts script, style, and image sources
- **X-Frame-Options: DENY** - Prevents clickjacking
- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **Referrer-Policy** - Controls referrer information leakage
- **Permissions-Policy** - Disables dangerous browser features
- **Strict-Transport-Security** - Enforces HTTPS
- **CORS Configuration** - Restricts API access to allowed origins
- **Input Validation** - Zod schemas on all form submissions
- **XSS Sanitization** - HTML entity encoding on user input
- **Rate Limiting** - Per-IP request throttling on API routes
- **Honeypot Field** - Bot trap on contact form
- **Security Headers Middleware** - Applied globally via Next.js middleware
- **No Debug Mode** - Production builds run with debug disabled
- **Environment Variables** - Secrets isolated in `.env.local` (gitignored)
- **Gitignore** - Prevents accidental commits of secrets and build artifacts

## Checklist Before Deployment

- [ ] No API keys or secrets in source code
- [ ] `.env.local` is in `.gitignore`
- [ ] `vercel.json` / `next.config.js` security headers are present
- [ ] Contact form has validation, sanitization, and rate limiting
- [ ] No `console.log` of sensitive data in production
- [ ] Dependencies are up to date (`npm audit` passes)
- [ ] Git history has been reviewed for accidental secrets

## Dependency Audit

Run `npm audit` before each deployment to check for known vulnerabilities in dependencies.
