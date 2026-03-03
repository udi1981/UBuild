# UBuilder AI — Project Context

> AI-powered website builder platform. Wix + Shopify + HubSpot + AI Agent — all in one.
> Built as a TypeScript monorepo with Turborepo.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Backend:** Hono (runs on Cloudflare Workers + Node.js)
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Cache/Queue:** Redis (Upstash) + BullMQ
- **AI Models:** Claude API (complex tasks), Gemini 2.0 Flash (fast tasks), Gemini Nano (on-device browser)
- **Auth:** Better Auth (email + Google OAuth + magic links)
- **Payments:** Stripe (global) + PayPlus (Israel)
- **Storage:** Cloudflare R2 (S3-compatible, zero egress)
- **Search:** Meilisearch
- **Email:** Resend + React Email
- **Monitoring:** Sentry (errors) + PostHog (analytics)
- **Hosting:** Vercel (frontend/renderer) + Cloudflare Workers (API)

## Architecture Overview

```
apps/web        → Dashboard + Visual Editor (Next.js)
apps/api        → Backend API (Hono)
apps/renderer   → Published site renderer (Next.js SSG/ISR)
packages/db     → Drizzle ORM schemas & migrations
packages/ui     → Shared UI component library
packages/ai     → AI Router, generators, scanner, agent
packages/types  → Shared TypeScript types
packages/utils  → Shared utility functions
packages/config → ESLint, TSConfig, Tailwind shared config
```

## Key Architecture Decisions

1. **Block-based pages** — Pages stored as JSON tree of blocks (like Notion). Each block: `{ id, type, props, children, styles }`. Enables drag & drop, AI generation, and flexible rendering.
2. **AI Router pattern** — All AI requests go through `packages/ai/router.ts`. Router classifies task complexity and routes to the right model (Nano → Flash → Pro → Claude). Includes fallback chain and cost tracking.
3. **Monorepo** — Single repo, shared types, no version mismatches. Can split later.
4. **Mobile-first** — All UI designed for 375px first, then md: and lg: breakpoints. Bottom sheets on mobile, side panels on desktop.
5. **RTL-native** — All components use logical CSS properties (margin-inline-start, not margin-right). Hebrew + English.

## Coding Conventions

- TypeScript strict mode everywhere
- Use `type` not `interface` for type definitions
- File naming: `kebab-case.ts` (e.g., `commerce.service.ts`)
- Component naming: PascalCase (e.g., `ProductCard.tsx`)
- Use Next.js Server Actions for mutations
- Use Drizzle ORM — no raw SQL
- Error handling: Result pattern `{ ok: true, data } | { ok: false, error }` — avoid try/catch in business logic
- JSDoc comments on all exported functions
- Tests: Vitest (unit), Playwright (e2e)
- Tailwind only — no custom CSS files (except global tokens)
- Prefer `const` arrow functions for components: `const MyComponent = () => {}`
- All API routes require auth middleware (except public site routes)

## Directory Conventions

```
services/       → Business logic (one file per domain)
routes/         → API route definitions (thin, delegate to services)
middleware/     → Auth, rate-limit, validation
hooks/          → React custom hooks
components/     → React components (co-located with pages when possible)
lib/            → Utilities specific to an app
```

## Commands

```bash
pnpm dev          # Start all apps in dev mode
pnpm build        # Build everything
pnpm lint         # Lint all packages
pnpm test         # Run all tests
pnpm db:push      # Push Drizzle schema changes to DB
pnpm db:studio    # Open Drizzle Studio (DB GUI)
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Run migrations
```

## Environment Variables

```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CLAUDE_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET_URL=...
RESEND_API_KEY=re_...
BETTER_AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_URL=http://localhost:8787
```

## Important Rules

1. **ALWAYS read BACKLOG.md** before starting a new task
2. **ALWAYS update FIXES.md** when you find and fix a bug
3. **ALWAYS update BACKLOG.md** status after completing a task
4. **NEVER install new packages** without asking first — prefer existing deps
5. **ALWAYS run `pnpm build`** after changes to verify no type errors
6. **When creating a new service**, follow the pattern in existing services
7. **When creating a new UI component**, add it to packages/ui with Storybook story
8. **All text content** must support Hebrew (RTL) — use logical properties
9. **Prefer Server Components** in Next.js — only use 'use client' when needed
10. **Keep services thin** — max 200 lines per file, split if larger

## Current Sprint

See BACKLOG.md for current tasks and priorities.
See FIXES.md for known bugs and their solutions.
See ARCHITECTURE.md for detailed architecture decisions.
