# UBuilder AI — Backlog

> Last updated: 2026-03-04
> Current phase: **Phase 1 — Foundation** (1.4.2 done, continuing 1.3.3+)
>
> **Vision:** AI-powered website builder — build sites via prompt, clone from URL,
> AI chat sales bot, full commerce, CRM, subscriptions, analytics.
> Multi-language: he, en, zh, ru, ar, fr, pt, it, es, de, ja, ko.
> Payments: Stripe + PayPlus + PayMe.
>
> **Core principles:**
> - **Mobile-first** — EVERYTHING must work perfectly on mobile (375px+)
> - **RTL-native** — Hebrew, Arabic use logical CSS properties
> - **AI-everywhere** — Every feature should have AI assistance built in

---

## 🔥 Phase 1.0 — Project Setup

### [DONE] 1.0.1 — Initialize Monorepo ✅
- **Completed:** 2026-03-03

### [DONE] 1.0.2 — Docker Compose ✅
- **Completed:** 2026-03-03

### [DONE] 1.0.3 — Shared Config ✅
- **Completed:** 2026-03-03

---

## 🔥 Phase 1.1 — Database & Auth

### [DONE] 1.1.1 — Database Schema v1 ✅
- **Completed:** 2026-03-03

### [DONE] 1.1.2 — Auth System ✅
- **Completed:** 2026-03-03

### [DONE] 1.1.3 — Auth UI Pages ✅
- **Completed:** 2026-03-03

---

## 🔥 Phase 1.2 — Dashboard & Sites

### [DONE] 1.2.1 — Dashboard Layout ✅
- **Completed:** 2026-03-03

### [DONE] 1.2.2 — Dashboard Home Page ✅
- **Completed:** 2026-03-03

### [DONE] 1.2.3 — Sites Management ✅
- **Completed:** 2026-03-03

---

## 🔥 Phase 1.3 — Visual Editor

### [DONE] 1.3.1 — Block Type System ✅
- **Completed:** 2026-03-03

### [DONE] 1.3.2 — Editor Canvas ✅
- **Completed:** 2026-03-03

### [TODO] 1.3.3 — Properties Panel (Enhanced)
- Priority: **HIGH**
- Full style editor: colors, fonts, spacing, borders, shadows
- Responsive overrides per breakpoint (mobile/tablet/desktop)
- Desktop: right side panel | Mobile: bottom sheet
- **Files:** apps/web/src/components/editor/properties-panel.tsx (enhance)

### [TODO] 1.3.4 — Layers Panel (Enhanced)
- Priority: **MEDIUM**
- Drag to reorder in tree, toggle visibility, lock blocks
- **Files:** apps/web/src/components/editor/layers-panel.tsx (enhance)

### [TODO] 1.3.5 — Block Library Panel
- Priority: **HIGH**
- Drag from library into canvas, search/filter, preview thumbnails
- **Files:** apps/web/src/components/editor/block-library.tsx

---

## 🔥 Phase 1.4 — Save & Publish (E2E Flow)

### [DONE] 1.4.1 — Pages API (CRUD) ✅
- **Completed:** 2026-03-04
- Pages CRUD service with ownership verification (site→user chain)
- REST endpoints: GET/POST/PATCH/DELETE /api/sites/:siteId/pages
- Auto-create home page on site creation
- Publish endpoint
- **Files:** apps/api/src/services/pages.service.ts, routes/pages.routes.ts

### [DONE] 1.4.2 — Editor ↔ API Integration ✅
- **Completed:** 2026-03-04
- Editor loads page data from API on mount (replaces mock data)
- Save button writes blocksData to DB via PATCH
- Auto-save every 30s when dirty
- beforeunload warning for unsaved changes
- Pages list UI with create/delete
- Sites dashboard: "עמודים" button + redirect after create
- **Files:** apps/web/src/app/(editor)/[siteId]/[pageId]/page.tsx, sites/[id]/pages/page.tsx

### [TODO] 1.4.3 — Block Renderer
- Priority: **CRITICAL**
- BlockTree JSON → clean semantic HTML/CSS
- Render all 18 block types
- Apply site theme + block styles
- Responsive media queries
- **Files:** apps/renderer/src/lib/block-renderer.tsx

### [TODO] 1.4.4 — Site Publisher
- Priority: **CRITICAL**
- apps/renderer serves published sites by domain/subdomain
- SSG with ISR (revalidate on publish)
- SEO: meta tags, Open Graph, Schema.org, sitemap.xml
- Custom domain DNS setup (CNAME instructions)
- **Files:** apps/renderer/src/app/[...slug]/page.tsx

---

## 🔥 Phase 1.5 — AI Engine

### [TODO] 1.5.1 — AI Router
- Priority: **CRITICAL**
- Central routing: classify task → route to right model
- Models: Gemini Nano (browser) → Gemini Flash (fast) → Gemini Pro → Claude (complex)
- Fallback chain, cost tracking, Redis caching
- **Files:** packages/ai/src/router.ts, providers/

### [TODO] 1.5.2 — Website Scanner
- Priority: **HIGH**
- Input: URL → Puppeteer renders → extract structure, CSS, images, fonts, meta
- Deep analysis: identify design style, color palette, typography, layout patterns
- Output: ScanResult with full design DNA
- **Files:** packages/ai/src/scanner/

### [TODO] 1.5.3 — Scan-to-Blocks Converter
- Priority: **HIGH**
- Convert ScanResult → BlockTree (our format)
- AI-assisted: Claude maps HTML sections to composite blocks
- Upload images to R2, optimize
- **Files:** packages/ai/src/scanner/converter.ts

### [TODO] 1.5.4 — AI Content Writer
- Priority: **HIGH**
- Generate: headlines, paragraphs, CTAs, product descriptions, SEO meta, blog
- Multi-language support (12 languages)
- Tone control, alternatives generation
- **Files:** packages/ai/src/generators/content.ts

### [TODO] 1.5.5 — AI Prompt-to-Design
- Priority: **HIGH**
- Natural language prompt → full page layout with content
- Design gallery: user picks from AI-generated design variations
- Style preferences: modern, minimal, bold, corporate, playful...
- Multi-language prompts
- **Files:** packages/ai/src/generators/design.ts

### [TODO] 1.5.6 — SEO & GSO Engine
- Priority: **HIGH**
- SEO panel in editor: meta title, description, OG image, slug editor
- SEO score calculator (real-time)
- GSO (Generative Search Optimization):
  - Schema.org structured data (FAQ, Product, Article, LocalBusiness...)
  - Content structure optimized for AI citation
  - "AI visibility" score — is your site cited by ChatGPT/Perplexity/Google SGE?
- Auto-generate sitemap.xml, robots.txt
- **Files:** packages/ai/src/seo/, apps/web/src/components/editor/seo-panel.tsx

---

## 🔥 Phase 2 — Commerce

### [TODO] 2.1 — Products System
- Products CRUD with variants (size, color, etc.)
- Categories & collections
- AI-assisted product descriptions & images
- Inventory management
- **Files:** apps/api/src/services/products.service.ts, DB schema

### [TODO] 2.2 — Shopping Cart & Checkout
- Cart with add/remove/quantity
- Multi-step checkout: shipping → payment → confirmation
- AI upsell/cross-sell suggestions
- **Files:** apps/web/src/components/commerce/

### [TODO] 2.3 — Payments
- Stripe integration (global cards)
- PayPlus integration (Israeli cards)
- PayMe integration
- Webhook handlers for payment confirmation
- Refunds management
- **Files:** apps/api/src/services/payments.service.ts

### [TODO] 2.4 — Subscriptions
- Monthly/yearly subscription plans
- Subscription management dashboard
- Auto-renewal, cancellation, downgrade/upgrade
- Trial periods
- **Files:** apps/api/src/services/subscriptions.service.ts

### [TODO] 2.5 — Orders & Fulfillment
- Order management dashboard
- Status tracking (pending → paid → shipped → delivered)
- Email notifications (order confirmation, shipping, etc.)
- **Files:** apps/api/src/services/orders.service.ts

### [TODO] 2.6 — Coupons & Promotions
- Coupon codes (percentage, fixed, free shipping)
- Automatic promotions (buy X get Y, bundle discounts)
- Time-limited sales

---

## 🔥 Phase 3 — Intelligence & CRM

### [TODO] 3.1 — AI Chat Agent (Site Owner)
- Chat interface in dashboard — **full access to ALL site data**
- Query ANY data via natural language:
  - Sales: "כמה מכרתי החודש?", "מה המוצר הכי נמכר?", "הכנסות לפי חודש"
  - Subscriptions: "כמה מנויים פעילים?", "מי ביטל החודש?"
  - Traffic: "כמה כניסות היו אתמול?", "מאיפה מגיעים הגולשים?"
  - Cart/Checkout: "כמה עגלות ננטשו?", "מה אחוז ההמרה?"
  - Products: "כמה מוצרים יש לי?", "תראה מוצרים מתחת ל-100₪"
  - Content: "תייצר תיאור למוצר X", "תכתוב פוסט בלוג על Y"
  - Management: "תעדכן מחיר של מוצר X ל-99₪", "תוסיף קופון 10%"
- Generate reports & charts on demand
- Export to CSV/PDF from chat
- **Files:** apps/web/src/components/chat/, packages/ai/src/agent/

### [TODO] 3.2 — AI Sales Chatbot (Site Visitors)
- Embeddable chatbot widget on published sites
- Product recommendations from catalog
- Add to cart from chat
- Answer product questions using site content
- Lead capture
- Multi-language conversations
- **Files:** packages/ai/src/chatbot/, apps/renderer/src/components/chatbot/

### [TODO] 3.3 — CRM System
- Contacts database with tags & segments
- Lead scoring (AI-powered)
- Sales pipeline with stages
- Customer activity timeline
- Auto-segmentation based on behavior
- **Files:** apps/api/src/services/crm.service.ts

### [TODO] 3.4 — Analytics Dashboard
- Real-time visitors, page views, conversion
- Revenue analytics, top products
- Traffic sources, referrals
- AI insights: "מכירות עלו ב-20% השבוע בגלל..."
- Export reports
- **Files:** apps/web/src/app/(dashboard)/analytics/

### [TODO] 3.5 — Email Marketing
- Email campaigns with templates
- Segmented sending
- AI-generated email content
- Open/click tracking
- Automation flows (welcome, abandoned cart, re-engagement)
- **Files:** apps/api/src/services/email-marketing.service.ts

### [TODO] 3.6 — Automation Builder
- Visual flow builder: trigger → condition → action
- Triggers: new order, new subscriber, form submit, chat event
- Actions: send email, update CRM, notify, apply tag
- **Files:** apps/web/src/components/automations/

---

### [TODO] 3.7 — Smart Phone Integration (Caller ID + CRM)
- Incoming call detection → match phone to customer in CRM
- Instant customer card popup: name, purchase history, subscription status, lifetime value
- Click-to-call from CRM
- Call logging & notes
- Mobile-optimized dashboard for phone use (one-hand operation)
- **Files:** apps/web/src/components/phone/, apps/api/src/services/phone.service.ts

---

## 🔥 Phase 4 — Scale & Polish

### [TODO] 4.1 — Multi-language (i18n)
- 12 languages: he, en, zh, ru, ar, fr, pt, it, es, de, ja, ko
- Dashboard UI translated
- Site content translation (AI-assisted)
- RTL support for he, ar
- Language switcher

### [TODO] 4.2 — Custom Domains & DNS
- CNAME setup wizard
- SSL auto-provisioning
- Domain verification
- Subdomain support (mysite.ubuilder.app)

### [TODO] 4.3 — Template Marketplace
- Pre-built site templates by industry
- Community templates
- Template preview & one-click install

### [TODO] 4.4 — A/B Testing
- Test page variants
- Statistical significance calculator
- AI-recommended winning variant

### [TODO] 4.5 — PWA & Push Notifications
- Published sites as PWA (installable)
- Push notifications for sales, updates
- Offline support

### [TODO] 4.6 — White Label
- Custom branding for resellers
- Branded dashboard
- Custom domain for admin panel

---

## 📊 Priority Order (Next Steps)

1. **1.4.1-1.4.4** — Save & Publish (E2E flow — build → save → publish live site)
2. **1.5.1-1.5.5** — AI Engine (scanner, content writer, prompt-to-design)
3. **1.5.6** — SEO & GSO
4. **2.1-2.5** — Commerce (products, cart, payments, subscriptions)
5. **3.1-3.2** — AI Chat (owner dashboard + visitor sales bot)
6. **3.3-3.6** — CRM, Analytics, Email, Automations
7. **4.1-4.6** — i18n, domains, templates, A/B, PWA
