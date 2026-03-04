"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Save,
} from "lucide-react";
import { Button } from "@ubuilder/ui";
import { useEditor } from "@/lib/editor/editor-context";
import type { DevicePreview } from "@/lib/editor/editor-state";

const deviceIcons: Record<DevicePreview, typeof Monitor> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

const deviceOrder: DevicePreview[] = ["desktop", "tablet", "mobile"];

type EditorToolbarProps = {
  pageTitle?: string;
  siteId?: string;
};

/** Top toolbar: back, undo/redo, device preview, save */
export const EditorToolbar = ({ pageTitle = "עמוד ללא כותרת", siteId }: EditorToolbarProps) => {
  const router = useRouter();
  const { state, dispatch, canUndo, canRedo } = useEditor();

  const handleBack = () => {
    if (state.isDirty) {
      const confirmed = window.confirm("יש שינויים שלא נשמרו. לצאת בכל זאת?");
      if (!confirmed) return;
    }
    router.push(siteId ? `/sites/${siteId}/settings` : "/sites");
  };

  const handleSave = () => {
    // TODO: Save to API
    dispatch({ type: "MARK_SAVED" });
  };

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border-muted bg-bg-subtle px-3">
      {/* Back */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-fg-muted hover:text-fg hover:bg-bg-muted transition-colors"
      >
        <ArrowRight size={16} className="rotate-180 rtl:rotate-0" />
        <span className="hidden sm:inline">חזרה</span>
      </button>

      {/* Separator */}
      <div className="h-5 w-px bg-border-muted" />

      {/* Undo / Redo */}
      <button
        onClick={() => dispatch({ type: "UNDO" })}
        disabled={!canUndo}
        className="flex items-center justify-center rounded-md p-1.5 text-fg-muted hover:text-fg hover:bg-bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        title="ביטול (Ctrl+Z)"
      >
        <Undo2 size={16} />
      </button>
      <button
        onClick={() => dispatch({ type: "REDO" })}
        disabled={!canRedo}
        className="flex items-center justify-center rounded-md p-1.5 text-fg-muted hover:text-fg hover:bg-bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
        title="שחזור (Ctrl+Shift+Z)"
      >
        <Redo2 size={16} />
      </button>

      {/* Separator */}
      <div className="h-5 w-px bg-border-muted" />

      {/* Device preview toggles */}
      <div className="flex items-center gap-0.5">
        {deviceOrder.map((device) => {
          const Icon = deviceIcons[device];
          const isActive = state.devicePreview === device;
          return (
            <button
              key={device}
              onClick={() => dispatch({ type: "SET_DEVICE", device })}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-fg-muted hover:text-fg hover:bg-bg-muted"
              }`}
              title={device}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Page title */}
      <span className="hidden md:block truncate text-sm text-fg-muted max-w-48">
        {pageTitle}
      </span>

      {/* Dirty indicator */}
      {state.isDirty && (
        <span className="size-2 rounded-full bg-warning" title="שינויים שלא נשמרו" />
      )}

      {/* Save */}
      <Button size="sm" onClick={handleSave}>
        <Save size={14} />
        <span>שמור</span>
      </Button>
    </div>
  );
};
