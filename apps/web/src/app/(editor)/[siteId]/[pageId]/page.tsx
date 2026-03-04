"use client";

import { useParams } from "next/navigation";
import type { Block } from "@ubuilder/types";
import { EditorProvider, useEditor } from "@/lib/editor/editor-context";
import { EditorKeyboardHandler } from "@/components/editor/editor-keyboard-handler";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { Canvas } from "@/components/editor/canvas";
import { LayersPanel } from "@/components/editor/layers-panel";
import { PropertiesPanel } from "@/components/editor/properties-panel";

// ─── Mock Page Data ─────────────────────────────────────────────

const MOCK_BLOCKS: Block[] = [
  {
    id: "blk-hero-1",
    type: "hero",
    props: {
      title: "ברוכים הבאים לאתר שלנו",
      subtitle: "הפלטפורמה המתקדמת ביותר לבניית אתרים עם AI",
      ctaText: "התחל עכשיו",
      ctaHref: "#",
      alignment: "center" as const,
    },
    children: [],
    styles: {},
  },
  {
    id: "blk-section-1",
    type: "section",
    props: { fullWidth: false },
    children: [
      {
        id: "blk-heading-1",
        type: "heading",
        props: { content: "מה אנחנו מציעים", level: 2 as const, alignment: "start" as const },
        children: [],
        styles: {},
      },
      {
        id: "blk-para-1",
        type: "paragraph",
        props: {
          content: "אנחנו מספקים כלים מתקדמים לבניית אתרים, חנויות מקוונות ודפי נחיתה. הפלטפורמה שלנו משלבת עיצוב ויזואלי עם יכולות AI מתקדמות.",
          alignment: "start" as const,
        },
        children: [],
        styles: {},
      },
      {
        id: "blk-btn-1",
        type: "button",
        props: { text: "למידע נוסף", variant: "primary" as const, size: "md" as const, href: "#" },
        children: [],
        styles: {},
      },
    ],
    styles: {},
  },
  {
    id: "blk-features-1",
    type: "features",
    props: {
      title: "התכונות שלנו",
      items: [
        { title: "עיצוב ויזואלי", description: "גרור ושחרר בלוקים ליצירת עמודים מדהימים", icon: "Palette" },
        { title: "AI חכם", description: "יצירת תוכן וקוד אוטומטי עם בינה מלאכותית", icon: "Sparkles" },
        { title: "מובייל ראשון", description: "כל האתרים מותאמים מושלם למובייל", icon: "Smartphone" },
      ],
      columns: 3 as const,
    },
    children: [],
    styles: {},
  },
  {
    id: "blk-cta-1",
    type: "cta",
    props: {
      title: "מוכנים להתחיל?",
      description: "הצטרפו לאלפי עסקים שכבר בונים עם UBuilder",
      buttonText: "הרשמה חינם",
      buttonHref: "#",
      alignment: "center" as const,
    },
    children: [],
    styles: {},
  },
  {
    id: "blk-footer-1",
    type: "footer",
    props: { copyright: "© 2026 UBuilder AI — כל הזכויות שמורות" },
    children: [],
    styles: {},
  },
];

// ─── Editor Page ────────────────────────────────────────────────

/** Editor page — loads page data and renders the full editor */
const EditorPage = () => {
  const params = useParams<{ siteId: string; pageId: string }>();

  return (
    <EditorProvider initialBlocks={MOCK_BLOCKS}>
      <EditorKeyboardHandler>
        {/* Toolbar */}
        <EditorToolbar
          pageTitle="עמוד ראשי"
          siteId={params.siteId}
        />

        {/* 3-panel layout */}
        <div className="flex flex-1 min-h-0">
          <LayersPanel />
          <Canvas />
          <PropertiesPanel />
        </div>

        {/* Mobile bottom action bar */}
        <MobileActionBar />
      </EditorKeyboardHandler>
    </EditorProvider>
  );
};

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
