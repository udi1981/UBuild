"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { BlockType, BlockCategory } from "@ubuilder/types";
import { BLOCK_CATEGORIES, BLOCK_REGISTRY } from "@ubuilder/types";
import { useEditor } from "@/lib/editor/editor-context";
import { createBlock } from "@/lib/editor/block-utils";

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  layout: "פריסה",
  text: "טקסט",
  media: "מדיה",
  interactive: "אינטראקטיבי",
  utility: "כלי עזר",
  composite: "מורכב",
};

type AddBlockDialogProps = {
  parentId: string | null;
  index: number;
  onClose: () => void;
};

/** Modal dialog to pick a block type and insert it */
export const AddBlockDialog = ({ parentId, index, onClose }: AddBlockDialogProps) => {
  const { dispatch } = useEditor();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid closing immediately from the triggering click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  const handleSelectBlock = useCallback(
    (type: BlockType) => {
      const newBlock = createBlock(type);
      dispatch({ type: "ADD_BLOCK", parentId, index, block: newBlock });
      onClose();
    },
    [dispatch, parentId, index, onClose],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div
        ref={dialogRef}
        className="mx-4 max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl border border-border-muted bg-bg-subtle p-4 shadow-xl animate-slide-up"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">הוסף בלוק</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-md p-1 text-fg-muted hover:text-fg hover:bg-bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Block categories */}
        <div className="flex flex-col gap-4">
          {(Object.entries(BLOCK_CATEGORIES) as [BlockCategory, readonly BlockType[]][]).map(
            ([category, types]) => (
              <div key={category}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  {CATEGORY_LABELS[category]}
                </h3>
                <div className="grid grid-cols-3 gap-1.5">
                  {types.map((type) => {
                    const meta = BLOCK_REGISTRY[type];
                    return (
                      <button
                        key={type}
                        onClick={() => handleSelectBlock(type)}
                        className="flex flex-col items-center gap-1.5 rounded-lg border border-border-muted bg-bg p-3 text-center transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        <span className="text-lg text-fg-muted">
                          {/* Use a simple text representation for the icon */}
                          {meta.label.slice(0, 2)}
                        </span>
                        <span className="text-xs font-medium text-fg">
                          {meta.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
