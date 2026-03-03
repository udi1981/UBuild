# UBuilder AI — Architecture Decisions

> This file documents WHY we chose each technology and pattern.
> Claude Code: read this to understand the reasoning behind decisions.

---

## ADR-001: Block-Based Page Structure

**Decision:** Pages stored as JSON tree of typed blocks
**Date:** 2026-03-03

```typescript
type Block = {
  id: string;
  type: BlockType;           // 'heading' | 'image' | 'section' | ...
  props: Record<string, any>; // type-specific properties
  children: Block[];          // nested blocks
  styles: StyleMap;           // { desktop: CSSProperties }
  responsiveStyles?: {        // breakpoint overrides
    tablet?: Partial<CSSProperties>;
    mobile?: Partial<CSSProperties>;
  };
};
```

**Why:**
- Enables visual drag & drop editing
- AI can generate/modify pages as JSON (no HTML parsing needed)
- Easy to render to any output (HTML, email, PDF, mobile app)
- Clean undo/redo (just snapshot the tree)
- Blocks are composable and reusable

**Alternatives considered:**
- Raw HTML storage → too rigid, hard to edit visually
- Markdown → not rich enough for layouts
- Prismic/Contentful-style slices → too opinionated

---

## ADR-002: AI Router Pattern

**Decision:** All AI requests route through a central orchestrator
**Date:** 2026-03-03

```
Request → AI Router → Classify complexity → Select model → Execute → Cache → Return
```

**Model tiers:**
| Tier | Model | Use case | Cost |
|------|-------|----------|------|
| 0 | Gemini Nano (browser) | Autocomplete, spell check | Free |
| 1 | Gemini 2.0 Flash | Content gen, translations | ~$0.01/req |
| 2 | Gemini 2.5 Pro | Site analysis, SEO audit | ~$0.05/req |
| 3 | Claude (Sonnet/Opus) | Agent tasks, code gen, strategy | ~$0.10+/req |

**Why:**
- Cost optimization: 60-80% savings vs always using premium
- Fallback chain: if Flash fails → try Pro → try Claude
- Easy to add/swap providers (OpenAI, Mistral, etc.)
- Centralized cost tracking and rate limiting
- Cache layer prevents duplicate AI calls

---

## ADR-003: Monorepo with Turborepo

**Decision:** Single monorepo, not microservices
**Date:** 2026-03-03

**Why:**
- One-person team — less operational overhead
- Shared TypeScript types prevent API/client mismatches
- Single `pnpm install`, single CI/CD pipeline
- Turborepo caches builds — still fast
- Can extract to microservices later if needed (packages are already isolated)

**Structure:**
- `apps/*` → Deployable applications (each has its own Vercel/CF project)
- `packages/*` → Shared libraries (never deployed alone)

---

## ADR-004: Hono for API

**Decision:** Use Hono instead of Express/Fastify/NestJS
**Date:** 2026-03-03

**Why:**
- Runs on Cloudflare Workers (edge — low latency globally)
- Also runs on Node.js (for local dev and fallback)
- TypeScript-native with type-safe routes
- Lightweight (~14KB), fast startup
- Web Standards based (Request/Response)
- Built-in middleware: CORS, JWT, rate-limit, validator

**Alternative considered:**
- Express → too old, no edge support
- Fastify → good but Node-only, heavier
- NestJS → too heavy for this project, over-engineered

---

## ADR-005: Drizzle ORM

**Decision:** Use Drizzle instead of Prisma
**Date:** 2026-03-03

**Why:**
- SQL-like API (you think in SQL, write in TypeScript)
- Works on edge runtimes (Cloudflare Workers)
- Lightweight — no heavy client generation step
- Type-safe queries and relations
- Drizzle Kit for migrations
- Drizzle Studio for visual DB browsing

**Alternative considered:**
- Prisma → too heavy for edge, slow cold starts, large client
- Knex → no type safety
- Raw SQL → no type safety, error-prone

---

## ADR-006: Better Auth

**Decision:** Use Better Auth for authentication
**Date:** 2026-03-03

**Why:**
- Open source, self-hosted (no vendor lock-in)
- Supports: email/password, OAuth (Google, GitHub), magic links
- Built for modern frameworks (Next.js, Hono)
- Session management with JWT
- Easy to extend with custom fields

**Alternative considered:**
- Clerk → great UX but expensive at scale, vendor lock-in
- NextAuth → only for Next.js, not for our separate API
- Supabase Auth → tied to Supabase ecosystem

---

## ADR-007: Mobile-First Adaptive UI

**Decision:** Three distinct UI modes, not just responsive CSS
**Date:** 2026-03-03

```
Mobile (< 768px):    Bottom tabs, bottom sheets, card views, swipe gestures
Tablet (768-1024px): Hybrid — collapsible sidebar, adaptive panels
Desktop (> 1024px):  Full sidebar, side panels, table views, keyboard shortcuts
```

**Why:**
- 70%+ of Israeli users browse on mobile
- Visual editor needs fundamentally different UX on mobile (list view) vs desktop (canvas)
- Bottom sheets > modals on mobile (easier to reach with thumb)
- Swipe gestures feel native on mobile

**Implementation:**
- `useMediaQuery()` hook switches between component variants
- Tailwind breakpoints: default=mobile, md:=tablet, lg:=desktop
- `vaul` library for bottom sheets
- `@use-gesture/react` for touch gestures

---

## ADR-008: Cloudflare R2 for Storage

**Decision:** Use R2 instead of S3/GCS
**Date:** 2026-03-03

**Why:**
- S3-compatible API (same SDK works)
- Zero egress costs (huge savings for image-heavy sites)
- Global edge caching built-in
- Integrated with Cloudflare Workers (our API host)
- Pay only for storage, not bandwidth

---

## ADR-009: Separate Renderer App

**Decision:** Published sites run in a separate Next.js app, not the dashboard
**Date:** 2026-03-03

**Why:**
- Dashboard has auth, heavy JS, complex state → slow
- Published sites need to be FAST (Core Web Vitals)
- Renderer uses SSG/ISR — pre-built HTML, minimal JS
- Can scale independently (CDN-heavy, low compute)
- Custom domain routing is simpler in isolation
- Security: published sites don't expose dashboard code

---

## ADR-010: Result Pattern for Error Handling

**Decision:** Use `Result<T, E>` pattern instead of try/catch
**Date:** 2026-03-03

```typescript
type Result<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

// Usage:
const result = await createProduct(data);
if (!result.ok) {
  return response.json({ error: result.error.message }, 400);
}
return response.json(result.data);
```

**Why:**
- Forces explicit error handling (can't forget)
- No silent failures
- Type-safe — TypeScript knows what's in `data` vs `error`
- Composable — easy to chain results
- Services never throw — API layer handles HTTP status codes
