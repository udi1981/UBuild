# UBuilder AI — Known Fixes & Gotchas

> When you encounter and fix a bug, document it here.
> This prevents Claude Code from repeating the same mistakes.
> Format: Issue → Fix → Date

---

## Drizzle ORM

- **Issue:** Better Auth v1.5.2 requires drizzle-orm >= 0.41.0, project had 0.38.4
  **Fix:** Upgraded drizzle-orm to 0.45.1 and drizzle-kit to 0.31.9
  **Root cause:** Initial setup used older Drizzle version
  **Date:** 2026-03-03

## Better Auth

- **Issue:** `advanced.generateId` causes TS error `'generateId' does not exist in type 'BetterAuthAdvancedOptions'`
  **Fix:** Correct path is `advanced.database.generateId: false` (nested under `database`)
  **Root cause:** Better Auth docs may show shorthand but the actual type nests it under `advanced.database`
  **Date:** 2026-03-03

## Next.js App Router

- **Issue:** Better Auth client with `baseURL: "/"` throws `BetterAuthError: Invalid base URL: /` during Next.js SSG prerendering
  **Fix:** Use absolute URL: `baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"`
  **Root cause:** Relative URLs can't be resolved during SSG (no server context). `createAuthClient` needs an absolute URL.
  **Date:** 2026-03-03

## TypeScript / Build

- **Issue:** `packages/ui` components using `document`, `KeyboardEvent` etc. fail to compile with `Cannot find name 'document'`
  **Fix:** Add `"lib": ["ES2022", "DOM", "DOM.Iterable"]` to `packages/ui/tsconfig.json` to override the library-only config
  **Root cause:** `packages/config/tsconfig/library.json` only includes `ES2022` (no DOM). UI components are client-side React and need DOM types.
  **Date:** 2026-03-03

## Tailwind CSS

*(No fixes yet)*

## Hono API

- **Issue:** `apps/api/src/services/sites.service.ts` importing from `drizzle-orm` directly fails with `Cannot find module 'drizzle-orm'`
  **Fix:** Add `"drizzle-orm": "^0.45.1"` to `apps/api/package.json` dependencies
  **Root cause:** `drizzle-orm` was only a dependency of `@ubuilder/db`, not `apps/api`. Service files importing operators (`eq`, `and`, `isNull`, `desc`) directly need the package as a direct dependency.
  **Date:** 2026-03-03

## AI Integration

*(No fixes yet)*

## RTL / Hebrew

*(No fixes yet)*

## Mobile / Responsive

*(No fixes yet)*

---

## Template for new fixes:

```
- **Issue:** [What went wrong]
  **Fix:** [How to fix it]
  **Root cause:** [Why it happened]
  **Date:** YYYY-MM-DD
```
