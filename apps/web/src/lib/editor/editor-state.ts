/**
 * Editor state types and reducer — manages blocks, selection, undo/redo.
 */

import type { Block } from "@ubuilder/types";
import { addBlock, removeBlock, moveBlock, updateBlockProps } from "./block-utils";

// ─── State ──────────────────────────────────────────────────────

export type DevicePreview = "desktop" | "tablet" | "mobile";

export type EditorState = {
  blocks: Block[];
  selectedBlockId: string | null;
  history: Block[][];
  future: Block[][];
  isDirty: boolean;
  devicePreview: DevicePreview;
};

export const createInitialState = (blocks: Block[] = []): EditorState => ({
  blocks,
  selectedBlockId: null,
  history: [],
  future: [],
  isDirty: false,
  devicePreview: "desktop",
});

// ─── Actions ────────────────────────────────────────────────────

export type EditorAction =
  | { type: "SELECT_BLOCK"; blockId: string | null }
  | { type: "ADD_BLOCK"; parentId: string | null; index: number; block: Block }
  | { type: "DELETE_BLOCK"; blockId: string }
  | { type: "MOVE_BLOCK"; blockId: string; targetParentId: string | null; targetIndex: number }
  | { type: "UPDATE_BLOCK"; blockId: string; props: Record<string, unknown> }
  | { type: "SET_DEVICE"; device: DevicePreview }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_BLOCKS"; blocks: Block[] }
  | { type: "MARK_SAVED" };

// ─── History Helpers ────────────────────────────────────────────

const MAX_HISTORY = 50;

/** Push current blocks to history, clear future */
const pushHistory = (state: EditorState): Pick<EditorState, "history" | "future"> => ({
  history: [...state.history.slice(-(MAX_HISTORY - 1)), state.blocks],
  future: [],
});

// ─── Reducer ────────────────────────────────────────────────────

export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "SELECT_BLOCK":
      return { ...state, selectedBlockId: action.blockId };

    case "ADD_BLOCK": {
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        blocks: addBlock(state.blocks, action.parentId, action.index, action.block),
        selectedBlockId: action.block.id,
        isDirty: true,
      };
    }

    case "DELETE_BLOCK": {
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        blocks: removeBlock(state.blocks, action.blockId),
        selectedBlockId:
          state.selectedBlockId === action.blockId ? null : state.selectedBlockId,
        isDirty: true,
      };
    }

    case "MOVE_BLOCK": {
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        blocks: moveBlock(
          state.blocks,
          action.blockId,
          action.targetParentId,
          action.targetIndex,
        ),
        isDirty: true,
      };
    }

    case "UPDATE_BLOCK": {
      const hist = pushHistory(state);
      return {
        ...state,
        ...hist,
        blocks: updateBlockProps(state.blocks, action.blockId, action.props),
        isDirty: true,
      };
    }

    case "SET_DEVICE":
      return { ...state, devicePreview: action.device };

    case "UNDO": {
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1]!;
      return {
        ...state,
        blocks: previous,
        history: state.history.slice(0, -1),
        future: [state.blocks, ...state.future],
        isDirty: true,
      };
    }

    case "REDO": {
      if (state.future.length === 0) return state;
      const next = state.future[0]!;
      return {
        ...state,
        blocks: next,
        history: [...state.history, state.blocks],
        future: state.future.slice(1),
        isDirty: true,
      };
    }

    case "SET_BLOCKS":
      return {
        ...state,
        blocks: action.blocks,
        history: [],
        future: [],
        selectedBlockId: null,
        isDirty: false,
      };

    case "MARK_SAVED":
      return { ...state, isDirty: false };

    default:
      return state;
  }
};
