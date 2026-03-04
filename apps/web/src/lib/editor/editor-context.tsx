"use client";

/**
 * Editor React Context — provides state and dispatch to all editor components.
 */

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import type { Block } from "@ubuilder/types";
import {
  editorReducer,
  createInitialState,
  type EditorState,
  type EditorAction,
} from "./editor-state";
import { findBlock } from "./block-utils";

// ─── Context Types ──────────────────────────────────────────────

type EditorContextValue = {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  selectedBlock: Block | null;
  canUndo: boolean;
  canRedo: boolean;
};

const EditorContext = createContext<EditorContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────

type EditorProviderProps = {
  initialBlocks?: Block[];
  children: ReactNode;
};

/** Wraps editor layout, provides state + dispatch to all editor components */
export const EditorProvider = ({ initialBlocks = [], children }: EditorProviderProps) => {
  const [state, dispatch] = useReducer(editorReducer, createInitialState(initialBlocks));

  const value = useMemo<EditorContextValue>(() => {
    const selectedBlock = state.selectedBlockId
      ? findBlock(state.blocks, state.selectedBlockId)
      : null;

    return {
      state,
      dispatch,
      selectedBlock,
      canUndo: state.history.length > 0,
      canRedo: state.future.length > 0,
    };
  }, [state, dispatch]);

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

// ─── Hook ───────────────────────────────────────────────────────

/** Access editor state and dispatch from any editor component */
export const useEditor = (): EditorContextValue => {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return ctx;
};
