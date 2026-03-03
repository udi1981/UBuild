# UBuilder AI — Backlog

> Last updated: 2026-03-03 (Phase 1.2.2 completed)
> Current phase: **Phase 1 — Foundation**

---

## 🔥 Phase 1.0 — Project Setup

### [DONE] 1.0.1 — Initialize Monorepo ✅
- Priority: **CRITICAL**
- Init Turborepo with pnpm workspaces
- Create apps: `web` (Next.js 15), `api` (Hono), `renderer` (Next.js)
- Create packages: `db`, `ui`, `ai`, `types`, `utils`, `config`
- Setup shared tsconfig, eslint, prettier
- Add turbo.json with pipeline config
- **Acceptance:** `pnpm dev` starts all 3 apps, `pnpm build` succeeds
- **Completed:** 2026-03-03

### [DONE] 1.0.2 — Docker Compose ✅
- Priority: **HIGH**
- PostgreSQL 16 + Redis 7 + Meilisearch
- Volumes for data persistence
- Health checks
- `.env.example` with all required vars
- **Acceptance:** `docker compose up` → all services healthy
- **Completed:** 2026-03-03

### [DONE] 1.0.3 — Shared Config ✅
- Priority: **HIGH**
- packages/config: shared ESLint rules, TSConfig, Tailwind config
- Tailwind CSS v4 with design tokens (colors, spacing, radius)
- Dark theme as default, light theme support via CSS variables
- RTL-ready: Tailwind v4 built-in logical properties (no plugin needed)
- **Acceptance:** All apps import config from packages/config
- **Completed:** 2026-03-03

---

## 🔥 Phase 1.1 — Database & Auth

### [DONE] 1.1.1 — Database Schema v1 ✅
- Priority: **CRITICAL**
- Setup Drizzle ORM in packages/db
- Tables: `users`, `sites`, `pages`, `blocks`, `media`
- Include: relations, indexes, enums (page_status, block_type, user_role)
- Timestamps: created_at, updated_at on all tables
- Neon serverless driver + Drizzle client factory
- JSONB columns for blocks_data, site theme, SEO metadata
- Inferred TypeScript types (User, Site, Page, Block, Media + New* variants)
- **Acceptance:** `pnpm db:push` creates all tables, `pnpm db:studio` shows them
- **Completed:** 2026-03-03 (build verified, db:push/studio require DATABASE_URL)

### [DONE] 1.1.2 — Auth System ✅
- Priority: **CRITICAL**
- Better Auth v1.5.2 in apps/api + apps/web
- Email + password login/register
- Google OAuth
- Magic link login (plugin)
- Cookie-based sessions with 7-day expiry + 5-min cache
- Protected routes middleware (requireAuth + optionalAuth)
- Auth schema: sessions, accounts, verifications tables in packages/db
- Next.js rewrite proxy for /api/auth/* → API server (no cross-origin cookie issues)
- Drizzle ORM upgraded to v0.45.1 for Better Auth compatibility
- **Files:** apps/api/src/lib/auth.ts, apps/api/src/middleware/auth.ts, apps/api/src/lib/app.ts, apps/web/src/lib/auth-client.ts
- **Completed:** 2026-03-03 (build verified)

### [DONE] 1.1.3 — Auth UI Pages ✅
- Priority: **CRITICAL**
- Shared UI components in packages/ui: Button, Input, Card, Alert, Separator, Spinner
- Login page with email/password, Google OAuth, and magic link (Hebrew RTL)
- Register page with name/email/password/confirm + Google OAuth
- Forgot password page with magic link + success state
- Auth layout with centered card + branding
- Mobile-first, RTL, dark theme
- Error/success states with Alert component
- **Files:** packages/ui/src/{button,input,card,alert,separator,spinner}.tsx, apps/web/src/app/(auth)/layout.tsx, login/page.tsx, register/page.tsx, forgot/page.tsx
- **Completed:** 2026-03-03 (build verified)

---

## 🔥 Phase 1.2 — Dashboard & Sites

### [DONE] 1.2.1 — Dashboard Layout ✅
- Priority: **HIGH**
- 5 new UI components: Avatar, Sidebar, Header, TabBar, Breadcrumbs
- Sidebar: desktop always-visible (w-64), mobile slide-in drawer from end (RTL)
- Header: hamburger (mobile), breadcrumbs slot, notification bell, user avatar
- Bottom tab bar: 5 tabs (Home, Sites, Commerce, Analytics, Settings), mobile only
- Breadcrumbs: RTL-aware with ChevronLeft separators
- Dashboard layout with auth guard (redirects to /login if unauthenticated)
- Dashboard home placeholder page
- Added DOM types to packages/ui tsconfig for client components
- Added lucide-react to apps/web dependencies
- Dark theme, RTL, responsive (mobile-first)
- **Files:** packages/ui/src/{avatar,sidebar,header,tab-bar,breadcrumbs}.tsx, apps/web/src/app/(dashboard)/layout.tsx, apps/web/src/app/(dashboard)/page.tsx
- **Completed:** 2026-03-03 (build verified)

### [DONE] 1.2.2 — Dashboard Home Page ✅
- Priority: **HIGH**
- StatCard reusable component in packages/ui (icon, value, trend indicator)
- 4 stat cards: revenue (₪12,450), visitors (1,284), orders (64), conversion (4.98%)
- Quick action buttons: edit site, new product, new post, ask AI (horizontal scroll mobile)
- Revenue sparkline SVG chart (30-day data, gradient fill)
- Recent orders table (desktop) / card list (mobile) with status badges
- Mock data with realistic Hebrew content
- Mobile-first: 2-col stats grid → 4-col on lg:, stacked layout
- **Files:** packages/ui/src/stat-card.tsx, apps/web/src/app/(dashboard)/page.tsx
- **Completed:** 2026-03-03 (build verified)

### [TODO] 1.2.3 — Sites Management
- Priority: **HIGH**
- Sites list page (cards on mobile, grid on desktop)
- Create new site: name, template selection
- Site settings page: name, domain, favicon, SEO defaults
- Delete site (soft delete)
- API routes: GET/POST/PATCH/DELETE /api/sites
- **Files:** apps/web/app/(dashboard)/sites/, apps/api/routes/sites.routes.ts

---

## 🔥 Phase 1.3 — Visual Editor

### [TODO] 1.3.1 — Block Type System
- Priority: **CRITICAL**
- Define block types in packages/types:
  - Section, Row, Column (layout)
  - Heading, Paragraph, RichText (text)
  - Image, Video, Icon (media)
  - Button, Link (interactive)
  - Spacer, Divider (utility)
  - Hero, Features, Testimonials, FAQ, CTA, Footer (composite)
- Each block: `{ id, type, props, children, styles, responsiveStyles }`
- **Files:** packages/types/blocks.ts

### [TODO] 1.3.2 — Editor Canvas
- Priority: **CRITICAL**
- Render block tree to visual preview
- Click to select block (highlight border)
- Drag to reorder blocks (within same level)
- Add block: floating "+" button between blocks
- Delete block: keyboard shortcut + button
- Undo/redo (command stack)
- Mobile: list view with tap-to-select, long-press to drag
- **Files:** apps/web/app/(editor)/canvas/

### [TODO] 1.3.3 — Properties Panel
- Priority: **HIGH**
- Desktop: right side panel
- Mobile: bottom sheet (drag up)
- Edit block props: text content, image URL, colors, spacing
- Style controls: font size, color, padding, margin, border-radius
- Responsive overrides: different styles per breakpoint
- **Files:** apps/web/app/(editor)/panels/properties/

### [TODO] 1.3.4 — Layers Panel
- Priority: **MEDIUM**
- Tree view of all blocks (collapsible)
- Drag to reorder in tree
- Toggle visibility, lock
- Desktop: left panel
- Mobile: bottom sheet
- **Files:** apps/web/app/(editor)/panels/layers/

### [TODO] 1.3.5 — Block Library Panel
- Priority: **HIGH**
- Categorized list of available blocks
- Drag from library into canvas
- Search/filter blocks
- Composite blocks with preview thumbnails
- **Files:** apps/web/app/(editor)/panels/blocks-library/

---

## 🔥 Phase 1.4 — Site Scanner & AI

### [TODO] 1.4.1 — Website Scanner Engine
- Priority: **HIGH**
- Input: URL string
- Process: Puppeteer renders page → extract HTML structure → parse CSS (colors, fonts, spacing) → download images → extract meta tags
- Output: ScanResult `{ structure, styles, images[], meta, fonts[] }`
- Handle: JS-rendered sites, SPAs, responsive differences
- **Files:** packages/ai/scanner/index.ts, scanner/parser.ts, scanner/extractor.ts

### [TODO] 1.4.2 — Scan-to-Blocks Converter
- Priority: **HIGH**
- Convert ScanResult into BlockTree (our format)
- Map HTML sections to composite blocks (Hero, Features, etc.)
- Extract and map CSS to our style format
- Upload images to R2
- Auto-enhance: image optimization, SEO improvements
- **Files:** packages/ai/scanner/converter.ts

### [TODO] 1.4.3 — AI Router
- Priority: **HIGH**
- Central routing for all AI requests
- Classify task: simple/medium/complex
- Route: Nano (browser) → Flash (quick) → Pro (complex) → Claude (premium)
- Fallback chain: if one fails, try next
- Cost tracking per request (log model, tokens, cost)
- Response caching (Redis)
- **Files:** packages/ai/router.ts, packages/ai/providers/

### [TODO] 1.4.4 — AI Content Writer
- Priority: **HIGH**
- Endpoint: POST /api/ai/content
- Types: headline, paragraph, cta, product_description, blog_intro, seo_meta
- Input: { type, context, language (he/en), tone }
- Output: { content, alternatives[] }
- Uses Flash for speed, Claude for quality (based on router)
- **Files:** packages/ai/generators/content.ts

### [TODO] 1.4.5 — AI Prompt-to-Design
- Priority: **MEDIUM**
- Endpoint: POST /api/ai/design
- Input: { prompt (natural language), style_preferences }
- Output: BlockTree JSON — full page layout with content
- Uses Gemini Pro for structure generation
- Support Hebrew prompts
- **Files:** packages/ai/generators/design.ts

---

## 🔥 Phase 1.5 — Site Publishing

### [TODO] 1.5.1 — Block Renderer
- Priority: **HIGH**
- Takes BlockTree JSON → outputs clean HTML/CSS
- Render each block type to semantic HTML
- Apply styles from block.styles + site theme
- Responsive: generate media queries from responsiveStyles
- **Files:** apps/renderer/lib/block-renderer.ts

### [TODO] 1.5.2 — Site Renderer App
- Priority: **HIGH**
- Next.js app that serves published sites
- Route: fetch site by domain → get pages → render blocks
- SSG with ISR (revalidate on publish)
- Inject SEO: meta tags, OG, schema.org, sitemap.xml
- **Files:** apps/renderer/app/[...slug]/page.tsx

### [TODO] 1.5.3 — Basic SEO Panel
- Priority: **MEDIUM**
- In editor: SEO tab with meta title, description, OG image
- Slug editor with auto-generate
- SEO score calculator (real-time)
- Auto-generate sitemap.xml
- robots.txt management
- **Files:** apps/web/app/(editor)/panels/seo/, apps/api/services/seo.service.ts

---

## 📋 Phase 2 — Commerce (FUTURE)
*Will be detailed when Phase 1 is complete*

- Products CRUD + variants + categories
- Shopping cart + checkout
- Stripe integration
- Order management
- Subscriptions engine
- Blog system
- CRM v1 (contacts, tags)
- Email notifications
- Coupons & promotions

## 📋 Phase 3 — Intelligence (FUTURE)

- AI Chat Agent
- Automation builder
- Analytics dashboard
- GSO engine
- A/B testing
- AI chatbot for sites
- Lead scoring

## 📋 Phase 4 — Scale (FUTURE)

- Multi-site dashboard
- Template marketplace
- Plugin system
- PWA + push notifications
- Multi-language (i18n)
- Email marketing
- White label
