"use client";

import { useEffect, useCallback } from "react";
import { useEditor } from "@/lib/editor/editor-context";

/** Keyboard shortcut handler — undo/redo/delete/escape */
export const EditorKeyboardHandler = ({ children }: { children: React.ReactNode }) => {
  const { state, dispatch } = useEditor();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;

      // Undo: Ctrl+Z
      if (isMeta && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (isMeta && ((e.shiftKey && e.key === "z") || e.key === "y")) {
        e.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }

      // Delete selected block: Delete or Backspace (when not in input)
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        state.selectedBlockId &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        e.preventDefault();
        dispatch({ type: "DELETE_BLOCK", blockId: state.selectedBlockId });
        return;
      }

      // Deselect: Escape
      if (e.key === "Escape" && state.selectedBlockId) {
        dispatch({ type: "SELECT_BLOCK", blockId: null });
      }
    },
    [dispatch, state.selectedBlockId],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return <>{children}</>;
};
