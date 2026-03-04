"use client";

import { useCallback } from "react";
import { Trash2 } from "lucide-react";
import { BLOCK_REGISTRY } from "@ubuilder/types";
import type { HeadingLevel } from "@ubuilder/types";
import { Button, Input, Separator } from "@ubuilder/ui";
import { useEditor } from "@/lib/editor/editor-context";

/** Right panel — edit selected block properties */
export const PropertiesPanel = () => {
  const { selectedBlock, dispatch } = useEditor();

  const handleUpdateProp = useCallback(
    (key: string, value: unknown) => {
      if (!selectedBlock) return;
      dispatch({
        type: "UPDATE_BLOCK",
        blockId: selectedBlock.id,
        props: { [key]: value },
      });
    },
    [selectedBlock, dispatch],
  );

  const handleDelete = useCallback(() => {
    if (!selectedBlock) return;
    dispatch({ type: "DELETE_BLOCK", blockId: selectedBlock.id });
  }, [selectedBlock, dispatch]);

  // ─── No Selection ─────────────────────────────────────────

  if (!selectedBlock) {
    return (
      <div className="hidden md:flex w-72 shrink-0 flex-col border-s border-border-muted bg-bg-subtle">
        <div className="flex h-10 items-center px-3 border-b border-border-muted">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            מאפיינים
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-center text-sm text-fg-subtle">
            בחר בלוק כדי לערוך את המאפיינים שלו
          </p>
        </div>
      </div>
    );
  }

  // ─── Selected Block ───────────────────────────────────────

  const meta = BLOCK_REGISTRY[selectedBlock.type];
  const props = selectedBlock.props as Record<string, unknown>;

  return (
    <div className="hidden md:flex w-72 shrink-0 flex-col border-s border-border-muted bg-bg-subtle">
      {/* Header */}
      <div className="flex h-10 items-center justify-between px-3 border-b border-border-muted">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          מאפיינים
        </span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
          {meta?.label || selectedBlock.type}
        </span>
      </div>

      {/* Properties form */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-4">
          {/* Text content fields */}
          {typeof props.content === "string" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-fg-muted">תוכן</label>
              <textarea
                value={props.content as string}
                onChange={(e) => handleUpdateProp("content", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-2 focus:outline-ring focus:border-ring resize-none"
              />
            </div>
          )}

          {/* Heading level */}
          {selectedBlock.type === "heading" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-fg-muted">רמת כותרת</label>
              <div className="flex gap-1">
                {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleUpdateProp("level", level)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                      (props.level as number) === level
                        ? "bg-primary text-primary-fg"
                        : "bg-bg text-fg-muted hover:bg-bg-muted"
                    }`}
                  >
                    H{level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title field for composite blocks */}
          {typeof props.title === "string" && selectedBlock.type !== "heading" && (
            <Input
              label="כותרת"
              value={props.title as string}
              onChange={(e) => handleUpdateProp("title", e.target.value)}
            />
          )}

          {/* Subtitle */}
          {typeof props.subtitle === "string" && (
            <Input
              label="כותרת משנה"
              value={props.subtitle as string}
              onChange={(e) => handleUpdateProp("subtitle", e.target.value)}
            />
          )}

          {/* Button/CTA text */}
          {typeof props.text === "string" && (
            <Input
              label="טקסט"
              value={props.text as string}
              onChange={(e) => handleUpdateProp("text", e.target.value)}
            />
          )}

          {typeof props.buttonText === "string" && (
            <Input
              label="טקסט כפתור"
              value={props.buttonText as string}
              onChange={(e) => handleUpdateProp("buttonText", e.target.value)}
            />
          )}

          {/* Href */}
          {typeof props.href === "string" && (
            <Input
              label="קישור (URL)"
              value={props.href as string}
              onChange={(e) => handleUpdateProp("href", e.target.value)}
              dir="ltr"
            />
          )}

          {typeof props.buttonHref === "string" && (
            <Input
              label="קישור כפתור"
              value={props.buttonHref as string}
              onChange={(e) => handleUpdateProp("buttonHref", e.target.value)}
              dir="ltr"
            />
          )}

          {/* Image src */}
          {typeof props.src === "string" && selectedBlock.type === "image" && (
            <Input
              label="כתובת תמונה"
              value={props.src as string}
              onChange={(e) => handleUpdateProp("src", e.target.value)}
              placeholder="https://..."
              dir="ltr"
            />
          )}

          {/* Alt text */}
          {typeof props.alt === "string" && (
            <Input
              label="טקסט חלופי"
              value={props.alt as string}
              onChange={(e) => handleUpdateProp("alt", e.target.value)}
            />
          )}

          {/* Spacer height */}
          {typeof props.height === "string" && selectedBlock.type === "spacer" && (
            <Input
              label="גובה"
              value={props.height as string}
              onChange={(e) => handleUpdateProp("height", e.target.value)}
              dir="ltr"
              placeholder="48px"
            />
          )}

          {/* Copyright */}
          {typeof props.copyright === "string" && (
            <Input
              label="זכויות יוצרים"
              value={props.copyright as string}
              onChange={(e) => handleUpdateProp("copyright", e.target.value)}
            />
          )}

          {/* Description */}
          {typeof props.description === "string" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-fg-muted">תיאור</label>
              <textarea
                value={props.description as string}
                onChange={(e) => handleUpdateProp("description", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-2 focus:outline-ring focus:border-ring resize-none"
              />
            </div>
          )}

          {/* HTML for rich text */}
          {typeof props.html === "string" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-fg-muted">HTML</label>
              <textarea
                value={props.html as string}
                onChange={(e) => handleUpdateProp("html", e.target.value)}
                rows={4}
                dir="ltr"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-xs font-mono text-fg placeholder:text-fg-subtle focus:outline-2 focus:outline-ring focus:border-ring resize-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete */}
      <div className="border-t border-border-muted p-3">
        <Separator className="mb-3" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="w-full border-error/50 text-error hover:bg-error/10"
        >
          <Trash2 size={14} />
          <span>מחק בלוק</span>
        </Button>
      </div>
    </div>
  );
};
