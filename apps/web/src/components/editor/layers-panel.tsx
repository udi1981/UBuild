"use client";

import { useState, useCallback } from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";
import type { Block } from "@ubuilder/types";
import { BLOCK_REGISTRY } from "@ubuilder/types";
import { useEditor } from "@/lib/editor/editor-context";

// ─── Layer Item ─────────────────────────────────────────────────

type LayerItemProps = {
  block: Block;
  depth: number;
};

const LayerItem = ({ block, depth }: LayerItemProps) => {
  const { state, dispatch } = useEditor();
  const [expanded, setExpanded] = useState(true);
  const isSelected = state.selectedBlockId === block.id;
  const meta = BLOCK_REGISTRY[block.type];
  const hasChildren = block.children.length > 0;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({ type: "SELECT_BLOCK", blockId: block.id });
    },
    [dispatch, block.id],
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setExpanded((prev) => !prev);
    },
    [],
  );

  return (
    <div>
      <button
        onClick={handleClick}
        className={`flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-start text-sm transition-colors ${
          isSelected
            ? "bg-primary/15 text-primary font-medium"
            : "text-fg-muted hover:bg-bg-muted hover:text-fg"
        }`}
        style={{ paddingInlineStart: `${depth * 16 + 8}px` }}
      >
        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <button onClick={handleToggle} className="shrink-0 p-0.5">
            {expanded ? <ChevronDown size={12} /> : <ChevronLeft size={12} />}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}

        {/* Block label */}
        <span className="truncate">{meta?.label || block.type}</span>
      </button>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {block.children.map((child) => (
            <LayerItem key={child.id} block={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Layers Panel ───────────────────────────────────────────────

/** Left panel — tree view of all blocks */
export const LayersPanel = () => {
  const { state } = useEditor();

  return (
    <div className="hidden md:flex w-60 shrink-0 flex-col border-e border-border-muted bg-bg-subtle">
      {/* Header */}
      <div className="flex h-10 items-center px-3 border-b border-border-muted">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          שכבות
        </span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-1.5">
        {state.blocks.length === 0 ? (
          <p className="p-3 text-center text-xs text-fg-subtle">אין בלוקים</p>
        ) : (
          state.blocks.map((block) => (
            <LayerItem key={block.id} block={block} depth={0} />
          ))
        )}
      </div>
    </div>
  );
};
