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

*(No fixes yet)*

## Tailwind CSS

*(No fixes yet)*

## Hono API

*(No fixes yet)*

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
