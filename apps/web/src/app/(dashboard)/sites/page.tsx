"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Globe,
  Settings as SettingsIcon,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button, Card, Alert, Spinner } from "@ubuilder/ui";

// ─── Types ──────────────────────────────────────────────────────

type Site = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string;
  customDomain: string | null;
  publishedAt: string | null;
  createdAt: string;
};

// ─── Mock Data (used when API is unavailable) ───────────────────

const mockSites: Site[] = [
  {
    id: "site-1",
    name: "החנות של דנה",
    slug: "dana-shop",
    description: "חנות מקוונת לתכשיטים בעבודת יד",
    language: "he",
    customDomain: null,
    publishedAt: "2026-02-15T10:00:00Z",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "site-2",
    name: "Tech Blog",
    slug: "tech-blog",
    description: "A blog about web development and AI",
    language: "en",
    customDomain: "techblog.example.com",
    publishedAt: null,
    createdAt: "2026-02-20T12:00:00Z",
  },
  {
    id: "site-3",
    name: "הפורטפוליו שלי",
    slug: "my-portfolio",
    description: "אתר תיק עבודות אישי",
    language: "he",
    customDomain: null,
    publishedAt: "2026-03-01T09:00:00Z",
    createdAt: "2026-02-28T15:00:00Z",
  },
];

// ─── Sites List Page ────────────────────────────────────────────

/** Sites management page — list, create, and manage sites */
const SitesPage = () => {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /** Fetch sites from API, fallback to mock data */
  const fetchSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sites");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.ok) {
        setSites(json.data);
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch {
      // Fallback to mock data when API is unavailable
      setSites(mockSites);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  /** Delete a site with confirmation */
  const handleDelete = async (siteId: string, siteName: string) => {
    const confirmed = window.confirm(`למחוק את "${siteName}"? פעולה זו ניתנת לביטול.`);
    if (!confirmed) return;

    setDeletingId(siteId);
    try {
      const res = await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSites((prev) => prev.filter((s) => s.id !== siteId));
    } catch {
      setError("שגיאה במחיקת האתר. נסה שנית.");
    } finally {
      setDeletingId(null);
    }
  };

  /** Format date to localized string */
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ─── Loading State ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">אתרים</h1>
          <p className="text-fg-muted mt-1">ניהול האתרים שלך</p>
        </div>
        <Button onClick={() => router.push("/sites/new")}>
          <Plus size={18} />
          <span>אתר חדש</span>
        </Button>
      </div>

      {/* Error alert */}
      {error && (
        <Alert variant="error">{error}</Alert>
      )}

      {/* Empty state */}
      {sites.length === 0 && (
        <Card className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-bg-muted">
            <Globe size={32} className="text-fg-muted" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-fg">אין לך אתרים עדיין</h2>
            <p className="text-sm text-fg-muted mt-1">צור את האתר הראשון שלך כדי להתחיל</p>
          </div>
          <Button onClick={() => router.push("/sites/new")}>
            <Plus size={18} />
            <span>צור אתר חדש</span>
          </Button>
        </Card>
      )}

      {/* Sites grid */}
      {sites.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => {
            const isPublished = site.publishedAt != null;
            const isDeleting = deletingId === site.id;

            return (
              <Card
                key={site.id}
                className={`flex flex-col gap-3 p-4 transition-opacity ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
              >
                {/* Site header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-fg">
                      {site.name}
                    </h3>
                    <p className="truncate text-sm text-fg-muted" dir="ltr">
                      /{site.slug}
                    </p>
                  </div>
                  {/* Status badge */}
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isPublished
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {isPublished ? "פורסם" : "טיוטה"}
                  </span>
                </div>

                {/* Description */}
                {site.description && (
                  <p className="line-clamp-2 text-sm text-fg-muted">
                    {site.description}
                  </p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-fg-subtle">
                  {/* Language badge */}
                  <span className="rounded bg-bg-muted px-1.5 py-0.5 font-medium uppercase">
                    {site.language}
                  </span>
                  {/* Custom domain */}
                  {site.customDomain && (
                    <span className="flex items-center gap-1" dir="ltr">
                      <ExternalLink size={12} />
                      {site.customDomain}
                    </span>
                  )}
                  {/* Created date */}
                  <span className="ms-auto">{formatDate(site.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t border-border-muted pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/sites/${site.id}/settings`)}
                    className="flex-1"
                  >
                    <SettingsIcon size={14} />
                    <span>הגדרות</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(site.id, site.name)}
                    className="text-error hover:bg-error/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SitesPage;
