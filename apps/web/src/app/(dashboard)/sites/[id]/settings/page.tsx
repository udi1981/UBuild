"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button, Input, Card, Alert, Spinner, Separator } from "@ubuilder/ui";

// ─── Types ──────────────────────────────────────────────────────

type Site = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string;
  customDomain: string | null;
  favicon: string | null;
  publishedAt: string | null;
  createdAt: string;
};

// ─── Mock Data ──────────────────────────────────────────────────

const mockSites: Record<string, Site> = {
  "site-1": {
    id: "site-1",
    name: "החנות של דנה",
    slug: "dana-shop",
    description: "חנות מקוונת לתכשיטים בעבודת יד",
    language: "he",
    customDomain: null,
    favicon: null,
    publishedAt: "2026-02-15T10:00:00Z",
    createdAt: "2026-01-10T08:00:00Z",
  },
  "site-2": {
    id: "site-2",
    name: "Tech Blog",
    slug: "tech-blog",
    description: "A blog about web development and AI",
    language: "en",
    customDomain: "techblog.example.com",
    favicon: null,
    publishedAt: null,
    createdAt: "2026-02-20T12:00:00Z",
  },
  "site-3": {
    id: "site-3",
    name: "הפורטפוליו שלי",
    slug: "my-portfolio",
    description: "אתר תיק עבודות אישי",
    language: "he",
    customDomain: null,
    favicon: null,
    publishedAt: "2026-03-01T09:00:00Z",
    createdAt: "2026-02-28T15:00:00Z",
  },
};

// ─── Site Settings Page ─────────────────────────────────────────

/** Edit site settings — name, slug, description, language, domain, delete */
const SiteSettingsPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const siteId = params.id;

  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("he");
  const [customDomain, setCustomDomain] = useState("");

  /** Fetch site data */
  const fetchSite = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sites/${siteId}`);
      if (!res.ok) throw new Error("Site not found");
      const json = await res.json();
      if (json.ok) {
        const s = json.data as Site;
        setSite(s);
        setName(s.name);
        setDescription(s.description ?? "");
        setLanguage(s.language);
        setCustomDomain(s.customDomain ?? "");
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch {
      // Fallback to mock data
      const mock = mockSites[siteId];
      if (mock) {
        setSite(mock);
        setName(mock.name);
        setDescription(mock.description ?? "");
        setLanguage(mock.language);
        setCustomDomain(mock.customDomain ?? "");
      } else {
        setError("האתר לא נמצא");
      }
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchSite();
  }, [fetchSite]);

  /** Save site settings */
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("שם האתר הוא שדה חובה");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          language,
          customDomain: customDomain.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "שגיאה בשמירת ההגדרות");
      }

      setSite(json.data);
      setSuccess(true);
      // Clear success after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בשמירת ההגדרות. נסה שנית.");
    } finally {
      setSaving(false);
    }
  };

  /** Delete site */
  const handleDelete = async () => {
    if (!site) return;

    const confirmed = window.confirm(
      `למחוק את "${site.name}"? האתר יועבר לפח ויהיה ניתן לשחזור.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/sites");
    } catch {
      setError("שגיאה במחיקת האתר. נסה שנית.");
    }
  };

  // ─── Loading State ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  // ─── Not Found ──────────────────────────────────────────────

  if (!site) {
    return (
      <div className="mx-auto max-w-lg flex flex-col gap-4">
        <Alert variant="error">האתר לא נמצא</Alert>
        <Button variant="outline" onClick={() => router.push("/sites")}>
          חזרה לאתרים
        </Button>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-lg flex flex-col gap-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.push("/sites")}
        className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors self-start"
      >
        <ArrowRight size={16} className="rotate-180 rtl:rotate-0" />
        <span>חזרה לאתרים</span>
      </button>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-fg">הגדרות אתר</h1>
        <p className="text-fg-muted mt-1">{site.name}</p>
      </div>

      {/* Alerts */}
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">ההגדרות נשמרו בהצלחה</Alert>}

      {/* Settings form */}
      <Card>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Site name */}
          <Input
            label="שם האתר"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Slug (read-only display) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-fg">כתובת (slug)</label>
            <div
              className="flex h-10 items-center rounded-lg border border-border bg-bg-muted/50 px-3 text-sm text-fg-muted"
              dir="ltr"
            >
              /{site.slug}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-fg">
              תיאור
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="תיאור קצר של האתר"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-subtle px-3 py-2 text-sm text-fg placeholder:text-fg-subtle transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:border-ring resize-none"
            />
          </div>

          {/* Language */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="language" className="text-sm font-medium text-fg">
              שפה
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-bg-subtle px-3 text-sm text-fg transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-ring focus:border-ring"
            >
              <option value="he">עברית</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Custom domain */}
          <Input
            label="דומיין מותאם"
            placeholder="example.com"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            dir="ltr"
          />

          {/* Save button */}
          <Button type="submit" loading={saving}>
            שמור הגדרות
          </Button>
        </form>
      </Card>

      {/* Danger zone */}
      <Card className="border-error/30">
        <h2 className="text-base font-semibold text-error mb-2">אזור מסוכן</h2>
        <p className="text-sm text-fg-muted mb-4">
          מחיקת האתר תעביר אותו לפח. ניתן לשחזר תוך 30 יום.
        </p>
        <Separator className="mb-4" />
        <Button
          variant="outline"
          onClick={handleDelete}
          className="border-error/50 text-error hover:bg-error/10"
        >
          <Trash2 size={16} />
          <span>מחק אתר</span>
        </Button>
      </Card>
    </div>
  );
};

export default SiteSettingsPage;
