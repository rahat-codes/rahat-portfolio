# Rahat Md Mahadi Hasan — Portfolio

A modern, motion-led personal portfolio website built with Next.js, Tailwind CSS, and Framer Motion.

## About

This portfolio showcases the work, experience, and achievements of **Rahat Md Mahadi Hasan**, an AI & Computer Engineering student at Tongmyong University, Busan, South Korea.

## Tech Stack

- **Framework:** Next.js 14 (App Router, React 18)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## Sections

- **Hero** — Animated introduction with scramble text effect
- **About** — Personal background, education, languages
- **Experience** — Timeline of work and leadership roles
- **Projects** — Featured projects with GitHub links
- **Certifications & Honors** — Academic awards and certificates
- **Education** — University details
- **Skills** — Tech stack organized by category
- **Contact** — Contact form and contact details

## Data Source

All personal information is sourced from:
- Portfolio PDF: `입사지원서_최종_업데이트.pdf`
- GitHub: https://github.com/rahat-codes

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
cd rahat-portfolio
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Option 1: Vercel (Recommended)

1. Push this repository to GitHub
2. Connect your GitHub repo to [Vercel](https://vercel.com)
3. Deploy — Vercel auto-detects Next.js and configures everything

### Security Pre-Deployment Checklist

Before deploying, run through [`SECURITY_AUDIT.md`](./SECURITY_AUDIT.md):

1. Copy `.env.example` → `.env.local` (add any secrets, then **never commit it**)
2. Run `npm audit` — fix any high/critical vulnerabilities
3. Verify `.env.local` is in `.gitignore` (it is)
4. Commit and push (without `.env.local`)

### Security Features Included

- **CSP, X-Frame-Options, HSTS, and more** via `next.config.js`
- **Rate limiting** on `/api/contact` (5 req/min per IP)
- **Input validation** with Zod schemas
- **XSS sanitization** on all form inputs
- **Honeypot bot trap** on contact form
- **CORS restricted** to your domain only
- **Security middleware** at `src/middleware.ts`
- **Debug mode disabled** in production
- **`.env.local` and secrets gitignored**


### Option 2: Netlify

1. Push this repository to GitHub
2. Connect your GitHub repo to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`

### Option 3: Manual Deploy

```bash
npm run build
# Then deploy the .next folder or use a static host
```

## Customization

Edit the data files in `src/data/` to update your information:

- `personal.ts` — Name, contact info, bio, languages
- `experience.ts` — Work and leadership experience
- `projects.ts` — Project details and GitHub links
- `certifications.ts` — Awards and certificates
- `education.ts` — Academic background
- `skills.ts` — Technical skills by category

## License

All rights reserved. This portfolio is for personal use by Rahat Md Mahadi Hasan.
