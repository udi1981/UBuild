# 🚀 UBuilder AI — מדריך התחלה מהירה

## מה יש לך עכשיו

```
project-files/
├── CLAUDE.md          ← Claude Code קורא את זה אוטומטית
├── BACKLOG.md         ← כל המשימות של Phase 1 מפורקות
├── ARCHITECTURE.md    ← החלטות טכנולוגיות מתועדות
├── FIXES.md           ← ריק — ימולא תוך כדי עבודה
├── .env.example       ← כל environment variables
├── docker-compose.yml ← PostgreSQL + Redis + Meilisearch
└── GETTING-STARTED.md ← המדריך הזה
```

---

## שלב 1: התקנת כלים (פעם אחת)

```bash
# 1. Node.js 20+ (אם אין)
# הורד מ-https://nodejs.org

# 2. pnpm (package manager)
npm install -g pnpm

# 3. Docker Desktop
# הורד מ-https://docker.com/products/docker-desktop

# 4. Claude Code
npm install -g @anthropic-ai/claude-code

# 5. Git (אם אין)
# הורד מ-https://git-scm.com
```

---

## שלב 2: יצירת הפרויקט

```bash
# צור תיקייה
mkdir ubuilder-ai
cd ubuilder-ai

# אתחל git
git init

# העתק את הקבצים שיצרנו לשורש הפרויקט:
# CLAUDE.md, BACKLOG.md, ARCHITECTURE.md, FIXES.md,
# .env.example, docker-compose.yml

# צור .env מהדוגמה
cp .env.example .env

# הפעל את Docker services
docker compose up -d

# ודא שהכל רץ
docker compose ps
# צריך לראות: postgres (healthy), redis (healthy), meilisearch (healthy)
```

---

## שלב 3: פתח Claude Code

```bash
# בתיקיית הפרויקט:
claude
```

Claude Code יקרא אוטומטית את `CLAUDE.md` ויבין את ההקשר.

---

## שלב 4: התחל לבנות — משימה אחרי משימה

### הפרומפט הראשון:

```
קרא את BACKLOG.md ותתחיל עם משימה 1.0.1 — Initialize Monorepo.

צור Turborepo monorepo עם pnpm workspaces:
- apps/web: Next.js 15 עם App Router, Tailwind CSS v4
- apps/api: Hono
- apps/renderer: Next.js 15
- packages/db: Drizzle ORM (ריק לעכשיו)
- packages/ui: ריק עם index.ts
- packages/ai: ריק עם index.ts
- packages/types: ריק עם index.ts
- packages/utils: ריק עם index.ts
- packages/config: shared tsconfig, eslint, tailwind config

ודא ש-pnpm dev מריץ את כל ה-apps ו-pnpm build עובד.
```

### אחרי שזה עובד:

```
עדכן את BACKLOG.md — סמן 1.0.1 כ-[DONE] ועבור ל-1.0.2.
תעשה git commit עם הודעה: "feat: initialize monorepo with turborepo"
```

### המשימה הבאה:

```
קרא את BACKLOG.md ותעבוד על 1.0.2 — Docker Compose.
הdocker-compose.yml כבר קיים בשורש.
ודא שהכל עובד עם docker compose up -d.
עדכן את .env עם הערכים המקומיים.
```

### וככה ממשיכים — משימה אחרי משימה.

---

## 📋 סדר העבודה המומלץ

| # | משימה | זמן משוער | הפרומפט |
|---|--------|-----------|---------|
| 1 | Init Monorepo | 30 דק | "צור Turborepo monorepo..." |
| 2 | Docker Compose | 15 דק | "ודא ש-docker compose עובד..." |
| 3 | Shared Config | 20 דק | "הגדר shared eslint, tsconfig, tailwind..." |
| 4 | DB Schema v1 | 45 דק | "צור Drizzle schemas: users, sites, pages, blocks, media..." |
| 5 | Auth System | 60 דק | "הגדר Better Auth עם email + Google OAuth..." |
| 6 | Auth UI | 45 דק | "צור דפי login, register, forgot password..." |
| 7 | Dashboard Layout | 60 דק | "בנה dashboard layout: sidebar + bottom tabs..." |
| 8 | Dashboard Home | 45 דק | "צור dashboard home page עם stats cards..." |
| 9 | Sites CRUD | 60 דק | "צור sites management: list, create, settings..." |
| 10 | Block System | 45 דק | "הגדר block types ב-packages/types..." |
| 11 | Visual Editor | 3 שעות | "בנה visual editor: canvas, select, drag..." |
| 12 | Properties Panel | 60 דק | "בנה properties panel ב-editor..." |
| 13 | Site Scanner | 2 שעות | "בנה scanner service שמקבל URL..." |
| 14 | AI Router | 90 דק | "בנה AI Router ב-packages/ai..." |
| 15 | AI Content | 60 דק | "הוסף AI content writer..." |
| 16 | Site Renderer | 2 שעות | "בנה renderer שמרנדר blocks ל-HTML..." |
| 17 | Basic SEO | 60 דק | "הוסף SEO panel בeditor..." |

**סה"כ Phase 1: ~80-100 שעות עבודה**

---

## 🔄 ה-Workflow היומי

```
1. פתח Claude Code:        cd ubuilder-ai && claude
2. תגיד:                   "קרא BACKLOG.md ועבוד על המשימה הבאה"
3. למשימות גדולות:          "תכנן לי את המשימה הזו לפני שתתחיל"
4. אחרי כל משימה:           "תריץ pnpm build ותבדוק שאין errors"
5. עדכן docs:               "עדכן BACKLOG.md ואם היה באג — FIXES.md"
6. שמור:                    "git add -A && git commit -m 'feat: ...'"
```

---

## ⚡ טיפים חשובים

### 1. משימות קטנות
לא: "תבנה לי את כל ה-editor"
כן: "צור את block type system" → "צור את canvas component" → "הוסף drag & drop"

### 2. תמיד Plan Mode למשימות מורכבות
"תכנן לי את ה-Visual Editor — מה הקבצים, מה הסדר, מה ה-dependencies. אל תכתוב קוד עדיין."

### 3. תפנה לקוד קיים
"תקרא את auth.service.ts ותצור service חדש ל-commerce באותו פטרן"

### 4. תבדוק build אחרי כל שינוי
"תריץ pnpm build && pnpm lint ותתקן כל error"

### 5. תעדכן docs בסוף כל session
"תעדכן BACKLOG.md — מה סיימנו, מה נשאר"

### 6. אל תתן לו להתקין חופשי
ב-CLAUDE.md יש: "NEVER install packages without asking first"

---

## 🏗️ MCP Servers — הגדרה מומלצת

צור קובץ `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:password@localhost:5432/ubuilder"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/ubuilder-ai"
      ]
    }
  }
}
```

---

## 🎯 Milestones — מתי יש לך משהו שעובד

| Milestone | אחרי משימה | מה עובד |
|-----------|-----------|---------|
| 🔐 Auth works | #6 | משתמש יכול להירשם ולהתחבר |
| 🏠 Dashboard | #9 | dashboard עובד, ניהול אתרים |
| ✏️ Editor v1 | #12 | עורך ויזואלי עם drag & drop |
| 🔍 Scanner | #13 | אפשר לסרוק ולשכפל אתר |
| 🧠 AI works | #15 | AI מייצר תוכן ומעצב |
| 🌐 Site live! | #16 | אתר שנבנה בפלטפורמה — חי באינטרנט |
| 🏁 Phase 1 done | #17 | MVP מלא — builder + scanner + AI + SEO |

---

## 🆘 אם נתקעת

1. **Build fails:** "תראה לי את ה-errors ותתקן אותם אחד אחד"
2. **לא יודע מה הבא:** "קרא BACKLOG.md ותמצא את המשימה הראשונה שעדיין TODO"
3. **באג חוזר:** "קרא FIXES.md — אולי כבר תיקנו את זה בעבר"
4. **צריך לזכור מה עשינו:** "תסכם מה עשינו ב-session הזה ותעדכן את BACKLOG.md"
5. **Claude Code איבד הקשר:** סגור ופתח מחדש — הוא יקרא CLAUDE.md מחדש

---

בהצלחה! 🚀
