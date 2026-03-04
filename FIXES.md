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

- **Issue:** Drizzle adapter error `The model "users" was not found in the schema object` when signing up
  **Fix:** Pass the full schema object (`schema`) instead of manually mapping singular keys (`{ user: schema.users, ... }`). With `usePlural: true`, Better Auth looks up plural keys (`users`, `sessions`, etc.) in the schema object.
  **Root cause:** The schema mapping used singular keys (`user`, `session`, `account`, `verification`) but `usePlural: true` makes Better Auth look for plural keys matching the table names.
  **Date:** 2026-03-04

- **Issue:** `localhost` vs `127.0.0.1` origin mismatch causes CORS failures and "Invalid origin" errors
  **Fix:** (1) In `auth-client.ts`, use `window.location.origin` in browser instead of hardcoded URL. (2) In `auth.ts`, add `"http://127.0.0.1:3001"` to `trustedOrigins`. (3) In `index.ts`, change CORS `origin` from string to function that checks an array of trusted origins.
  **Root cause:** Browser on `127.0.0.1:3001` treats `localhost:3001` as a different origin. Both must be in trustedOrigins and CORS allowed origins.
  **Date:** 2026-03-04

## Next.js App Router

- **Issue:** Better Auth client with `baseURL: "/"` throws `BetterAuthError: Invalid base URL: /` during Next.js SSG prerendering
  **Fix:** Use absolute URL: `baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"`
  **Root cause:** Relative URLs can't be resolved during SSG (no server context). `createAuthClient` needs an absolute URL.
  **Date:** 2026-03-03

- **Issue:** Next.js App Router layout files exporting named components alongside `default` causes build error: `Property 'ComponentName' is incompatible with index signature`
  **Fix:** Extract named components to separate files (e.g., `editor-keyboard-handler.tsx`). Layout files can only export `default` and specific metadata exports (`metadata`, `generateMetadata`, `generateStaticParams`).
  **Root cause:** Next.js enforces strict type constraints on route files — named exports are treated as metadata and must match `{ [x: string]: never }`.
  **Date:** 2026-03-03

- **Issue:** `JSX.IntrinsicElements` causes `Cannot find namespace 'JSX'` in React 19 with Next.js 15
  **Fix:** Use `React.ElementType` instead of `keyof JSX.IntrinsicElements` for dynamic tag rendering
  **Root cause:** In React 19, the `JSX` global namespace was removed. Use `React.JSX.IntrinsicElements` or `React.ElementType` instead.
  **Date:** 2026-03-03

## Auth Pages

- **Issue:** Auth pages (login/register) button stays in loading state forever when API server is unreachable; no error message shown
  **Fix:** Wrap `authClient.signUp.email()`, `authClient.signIn.email()`, and `authClient.signIn.magicLink()` calls in try/catch to handle network errors gracefully
  **Root cause:** When the Hono API server (port 8787) is not running, the fetch throws a network error. Without try/catch, the error is uncaught and `setLoading(false)` never runs.
  **Date:** 2026-03-04

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
