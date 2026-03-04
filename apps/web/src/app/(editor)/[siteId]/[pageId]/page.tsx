"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import type { Block } from "@ubuilder/types";
import { Spinner, Alert, Button } from "@ubuilder/ui";
import { EditorProvider, useEditor } from "@/lib/editor/editor-context";
import { EditorKeyboardHandler } from "@/components/editor/editor-keyboard-handler";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { Canvas } from "@/components/editor/canvas";
import { LayersPanel } from "@/components/editor/layers-panel";
import { PropertiesPanel } from "@/components/editor/properties-panel";

// ─── Types ─────────────────────────────────────────────────────

type PageData = {
  id: string;
  title: string;
  slug: string;
  status: string;
  blocksData: Block[];
  siteId: string;
};

// ─── Editor Page (Wrapper) ─────────────────────────────────────

/** Editor page — loads page data from API and renders the editor */
const EditorPage = () => {
  const params = useParams<{ siteId: string; pageId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageData | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/sites/${params.siteId}/pages/${params.pageId}`);
        if (!res.ok) throw new Error("Page not found");
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Failed to load page");
        setPageData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "לא ניתן לטעון את העמוד");
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [params.siteId, params.pageId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={32} />
          <p className="text-sm text-fg-muted">טוען עמוד...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !pageData) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <Alert variant="error">{error || "עמוד לא נמצא"}</Alert>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            חזרה
          </Button>
        </div>
      </div>
    );
  }

  // Render editor with real data
  return (
    <EditorProvider initialBlocks={(pageData.blocksData ?? []) as Block[]}>
      <EditorInner
        pageData={pageData}
        siteId={params.siteId!}
        pageId={params.pageId!}
      />
    </EditorProvider>
  );
};

// ─── Editor Inner (uses useEditor) ─────────────────────────────

type EditorInnerProps = {
  pageData: PageData;
  siteId: string;
  pageId: string;
};

/** Inner editor component that has access to useEditor() */
const EditorInner = ({ pageData, siteId, pageId }: EditorInnerProps) => {
  const { state, dispatch } = useEditor();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const savingRef = useRef(false);

  /** Save blocks to API */
  const handleSave = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(`/api/sites/${siteId}/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocksData: state.blocks }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "שגיאה בשמירה");
      }
      dispatch({ type: "MARK_SAVED" });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "שגיאה בשמירה");
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }, [siteId, pageId, state.blocks, dispatch]);

  /** Auto-save: debounced 30s when dirty */
  useEffect(() => {
    if (!state.isDirty) return;

    const timeout = setTimeout(() => {
      handleSave();
    }, 30_000);

    return () => clearTimeout(timeout);
  }, [state.isDirty, state.blocks, handleSave]);

  /** Unsaved changes warning */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state.isDirty]);

  return (
    <EditorKeyboardHandler>
      {/* Toolbar */}
      <EditorToolbar
        pageTitle={pageData.title}
        siteId={siteId}
        onSave={handleSave}
        saving={saving}
      />

      {/* Save error banner */}
      {saveError && (
        <div className="px-3 py-1.5 bg-error/10 text-error text-sm text-center">
          {saveError}
          <button
            onClick={() => setSaveError(null)}
            className="ms-2 underline hover:no-underline"
          >
            סגור
          </button>
        </div>
      )}

      {/* 3-panel layout */}
      <div className="flex flex-1 min-h-0">
        <LayersPanel />
        <Canvas />
        <PropertiesPanel />
      </div>

      {/* Mobile bottom action bar */}
      <MobileActionBar />
    </EditorKeyboardHandler>
  );
};

// ─── Mobile Action Bar ─────────────────────────────────────────

/** Mobile bottom bar with quick actions */
const MobileActionBar = () => {
  const { state, dispatch, canUndo, canRedo } = useEditor();

  return (
    <div className="flex md:hidden h-12 items-center justify-around border-t border-border-muted bg-bg-subtle px-2">
      <button
        onClick={() => dispatch({ type: "UNDO" })}
        disabled={!canUndo}
        className="flex flex-col items-center gap-0.5 p-1 text-xs text-fg-muted disabled:opacity-30"
      >
        <span className="text-base">↩</span>
        <span>ביטול</span>
      </button>
      <button
        onClick={() => dispatch({ type: "REDO" })}
        disabled={!canRedo}
        className="flex flex-col items-center gap-0.5 p-1 text-xs text-fg-muted disabled:opacity-30"
      >
        <span className="text-base">↪</span>
        <span>שחזור</span>
      </button>
      {state.selectedBlockId && (
        <button
          onClick={() => dispatch({ type: "DELETE_BLOCK", blockId: state.selectedBlockId! })}
          className="flex flex-col items-center gap-0.5 p-1 text-xs text-error"
        >
          <span className="text-base">🗑</span>
          <span>מחק</span>
        </button>
      )}
    </div>
  );
};

export default EditorPage;
