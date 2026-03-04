"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  FileText,
  ArrowRight,
  Home,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button, Card, Alert, Spinner } from "@ubuilder/ui";

type PageItem = {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  isHomePage: number;
  createdAt: string;
  updatedAt: string;
};

/** Pages list for a specific site */
const SitePagesPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const siteId = params.id;

  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /** Fetch pages from API */
  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sites/${siteId}/pages`);
      if (!res.ok) throw new Error("Failed to fetch pages");
      const json = await res.json();
      if (json.ok) {
        setPages(json.data);
      } else {
        throw new Error(json.error || "Unknown error");
      }
    } catch {
      setError("לא ניתן לטעון את רשימת העמודים. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  /** Create a new page */
  const handleCreatePage = async () => {
    const title = window.prompt("שם העמוד:");
    if (!title?.trim()) return;

    setCreating(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to create");
      // Navigate to editor for the new page
      router.push(`/${siteId}/${json.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה ביצירת עמוד");
    } finally {
      setCreating(false);
    }
  };

  /** Delete a page */
  const handleDelete = async (pageId: string, pageTitle: string) => {
    const confirmed = window.confirm(`למחוק את "${pageTitle}"? פעולה זו לא ניתנת לביטול.`);
    if (!confirmed) return;

    setDeletingId(pageId);
    try {
      const res = await fetch(`/api/sites/${siteId}/pages/${pageId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to delete");
      setPages((prev) => prev.filter((p) => p.id !== pageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה במחיקת העמוד");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-fg">עמודים</h1>
          <p className="text-fg-muted mt-1">ניהול עמודי האתר</p>
        </div>
        <Button onClick={handleCreatePage} loading={creating}>
          <Plus size={18} />
          <span>עמוד חדש</span>
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Empty state */}
      {pages.length === 0 && (
        <Card className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-bg-muted">
            <FileText size={32} className="text-fg-muted" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-fg">אין עמודים עדיין</h2>
            <p className="text-sm text-fg-muted mt-1">צור את העמוד הראשון שלך</p>
          </div>
          <Button onClick={handleCreatePage} loading={creating}>
            <Plus size={18} />
            <span>צור עמוד חדש</span>
          </Button>
        </Card>
      )}

      {/* Pages list */}
      {pages.length > 0 && (
        <div className="flex flex-col gap-3">
          {pages.map((page) => {
            const isDeleting = deletingId === page.id;
            const isPublished = page.status === "published";

            return (
              <Card
                key={page.id}
                className={`flex items-center gap-4 p-4 transition-opacity cursor-pointer hover:border-primary/30 ${
                  isDeleting ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => router.push(`/${siteId}/${page.id}`)}
              >
                {/* Icon */}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-muted">
                  {page.isHomePage === 1 ? (
                    <Home size={18} className="text-primary" />
                  ) : (
                    <FileText size={18} className="text-fg-muted" />
                  )}
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-medium text-fg">
                      {page.title}
                    </h3>
                    {page.isHomePage === 1 && (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-xs bg-primary/10 text-primary font-medium">
                        ראשי
                      </span>
                    )}
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        isPublished
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {isPublished ? "פורסם" : "טיוטה"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-fg-subtle mt-0.5">
                    <span dir="ltr">/{page.slug}</span>
                    <span>{formatDate(page.updatedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => router.push(`/${siteId}/${page.id}`)}
                    className="flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-bg-muted transition-colors"
                    title="עריכה"
                  >
                    <Pencil size={16} />
                  </button>
                  {page.isHomePage !== 1 && (
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
                      className="flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-error hover:bg-error/10 transition-colors"
                      title="מחיקה"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SitePagesPage;
