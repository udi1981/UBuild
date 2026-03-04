"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { useEditor } from "@/lib/editor/editor-context";
import { CanvasBlock } from "./canvas-block";
import { AddBlockDialog } from "./add-block-dialog";

const DEVICE_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
} as const;

/** Main canvas — renders block tree with device preview sizing */
export const Canvas = () => {
  const { state, dispatch } = useEditor();
  const [insertAt, setInsertAt] = useState<{
    parentId: string | null;
    index: number;
  } | null>(null);

  const handleInsert = useCallback(
    (parentId: string | null, index: number) => {
      setInsertAt({ parentId, index });
    },
    [],
  );

  const handleCloseDialog = useCallback(() => setInsertAt(null), []);

  /** Click on empty canvas area → deselect */
  const handleCanvasClick = useCallback(() => {
    dispatch({ type: "SELECT_BLOCK", blockId: null });
  }, [dispatch]);

  const maxWidth = DEVICE_WIDTHS[state.devicePreview];

  return (
    <div
      className="flex-1 overflow-y-auto bg-bg-muted/50 p-4 md:p-8"
      onClick={handleCanvasClick}
    >
      {/* Canvas frame */}
      <div
        className="mx-auto rounded-xl bg-bg-subtle shadow-lg transition-all duration-300"
        style={{ maxWidth }}
      >
        <div className="min-h-[60vh] p-4 md:p-6">
          {/* Block tree */}
          {state.blocks.map((block, index) => (
            <CanvasBlock
              key={block.id}
              block={block}
              parentId={null}
              index={index}
              onInsert={handleInsert}
            />
          ))}

          {/* Add block at end */}
          <div className="group/add relative flex items-center justify-center py-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleInsert(null, state.blocks.length);
              }}
              className="flex items-center gap-1.5 rounded-lg border-2 border-dashed border-border-muted px-4 py-3 text-sm text-fg-muted hover:border-primary hover:text-primary transition-colors"
            >
              <Plus size={16} />
              <span>הוסף בלוק</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add block dialog */}
      {insertAt && (
        <AddBlockDialog
          parentId={insertAt.parentId}
          index={insertAt.index}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};
