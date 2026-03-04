"use client";

import { useCallback, useState, type DragEvent } from "react";
import { GripVertical, Plus } from "lucide-react";
import type { Block, HeadingProps, ParagraphProps, ButtonBlockProps, ImageProps, HeroProps, FeaturesProps, SpacerProps, CtaProps, FaqProps, TestimonialsProps, FooterProps, DividerProps, RichTextProps } from "@ubuilder/types";
import { BLOCK_REGISTRY } from "@ubuilder/types";
import { useEditor } from "@/lib/editor/editor-context";

// ─── Block Content Renderers ────────────────────────────────────

const HeadingPreview = ({ props }: { props: HeadingProps }) => {
  const Tag = `h${props.level}` as React.ElementType;
  const sizes: Record<number, string> = { 1: "text-3xl", 2: "text-2xl", 3: "text-xl", 4: "text-lg", 5: "text-base", 6: "text-sm" };
  return <Tag className={`${sizes[props.level] ?? "text-xl"} font-bold`}>{props.content}</Tag>;
};

const ParagraphPreview = ({ props }: { props: ParagraphProps }) => (
  <p className="text-base leading-relaxed text-gray-700">{props.content}</p>
);

const RichTextPreview = ({ props }: { props: RichTextProps }) => (
  <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: props.html }} />
);

const ButtonPreview = ({ props }: { props: ButtonBlockProps }) => (
  <button className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
    {props.text}
  </button>
);

const ImagePreview = ({ props }: { props: ImageProps }) => (
  props.src ? (
    <img src={props.src} alt={props.alt} className="max-w-full rounded" style={{ objectFit: props.objectFit || "cover" }} />
  ) : (
    <div className="flex items-center justify-center rounded bg-gray-100 text-gray-400 text-sm" style={{ width: "100%", height: props.height || 200 }}>
      {props.alt || "תמונה"}
    </div>
  )
);

const SpacerPreview = ({ props }: { props: SpacerProps }) => (
  <div className="flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300 rounded" style={{ height: props.height }}>
    ↕ {props.height}
  </div>
);

const DividerPreview = ({ props }: { props: DividerProps }) => (
  <hr className="border-gray-300" style={{ borderWidth: props.thickness || "1px", width: props.width || "100%" }} />
);

const HeroPreview = ({ props }: { props: HeroProps }) => (
  <div className="flex flex-col items-center gap-4 rounded-lg bg-gradient-to-b from-blue-50 to-white p-8 text-center">
    <h1 className="text-3xl font-bold text-gray-900">{props.title}</h1>
    {props.subtitle && <p className="text-lg text-gray-600">{props.subtitle}</p>}
    {props.ctaText && (
      <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white">{props.ctaText}</button>
    )}
  </div>
);

const FeaturesPreview = ({ props }: { props: FeaturesProps }) => (
  <div className="p-4">
    {props.title && <h2 className="mb-4 text-xl font-bold text-center text-gray-900">{props.title}</h2>}
    <div className={`grid gap-4 grid-cols-${props.columns || 3}`}>
      {props.items.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-2 rounded-lg bg-gray-50 p-4 text-center">
          <span className="text-base font-semibold text-gray-900">{item.title}</span>
          <span className="text-sm text-gray-600">{item.description}</span>
        </div>
      ))}
    </div>
  </div>
);

const TestimonialsPreview = ({ props }: { props: TestimonialsProps }) => (
  <div className="p-4">
    {props.title && <h2 className="mb-4 text-xl font-bold text-center text-gray-900">{props.title}</h2>}
    <div className="flex flex-col gap-3">
      {props.items.map((item, i) => (
        <div key={i} className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-700 italic">"{item.content}"</p>
          <p className="mt-2 text-xs font-semibold text-gray-900">{item.name}</p>
        </div>
      ))}
    </div>
  </div>
);

const FaqPreview = ({ props }: { props: FaqProps }) => (
  <div className="p-4">
    {props.title && <h2 className="mb-4 text-xl font-bold text-center text-gray-900">{props.title}</h2>}
    <div className="flex flex-col gap-2">
      {props.items.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-3">
          <p className="text-sm font-semibold text-gray-900">{item.question}</p>
          <p className="mt-1 text-sm text-gray-600">{item.answer}</p>
        </div>
      ))}
    </div>
  </div>
);

const CtaPreview = ({ props }: { props: CtaProps }) => (
  <div className="flex flex-col items-center gap-3 rounded-lg bg-blue-50 p-8 text-center">
    <h2 className="text-2xl font-bold text-gray-900">{props.title}</h2>
    {props.description && <p className="text-gray-600">{props.description}</p>}
    <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white">{props.buttonText}</button>
  </div>
);

const FooterPreview = ({ props }: { props: FooterProps }) => (
  <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4 text-sm text-gray-500">
    {props.copyright || "Footer"}
  </div>
);

/** Render block content based on type */
const BlockContent = ({ block }: { block: Block }) => {
  switch (block.type) {
    case "heading": return <HeadingPreview props={block.props as HeadingProps} />;
    case "paragraph": return <ParagraphPreview props={block.props as ParagraphProps} />;
    case "rich_text": return <RichTextPreview props={block.props as RichTextProps} />;
    case "button": return <ButtonPreview props={block.props as ButtonBlockProps} />;
    case "image": return <ImagePreview props={block.props as ImageProps} />;
    case "spacer": return <SpacerPreview props={block.props as SpacerProps} />;
    case "divider": return <DividerPreview props={block.props as DividerProps} />;
    case "hero": return <HeroPreview props={block.props as HeroProps} />;
    case "features": return <FeaturesPreview props={block.props as FeaturesProps} />;
    case "testimonials": return <TestimonialsPreview props={block.props as TestimonialsProps} />;
    case "faq": return <FaqPreview props={block.props as FaqProps} />;
    case "cta": return <CtaPreview props={block.props as CtaProps} />;
    case "footer": return <FooterPreview props={block.props as FooterProps} />;
    default: {
      const meta = BLOCK_REGISTRY[block.type];
      return (
        <div className="flex items-center justify-center rounded bg-gray-50 p-4 text-sm text-gray-500">
          {meta?.label || block.type}
        </div>
      );
    }
  }
};

// ─── CanvasBlock Component ──────────────────────────────────────

type CanvasBlockProps = {
  block: Block;
  parentId: string | null;
  index: number;
  onInsert: (parentId: string | null, index: number) => void;
};

/** Renders a single block with selection chrome, drag handle, and add buttons */
export const CanvasBlock = ({ block, parentId, index, onInsert }: CanvasBlockProps) => {
  const { state, dispatch } = useEditor();
  const isSelected = state.selectedBlockId === block.id;
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = BLOCK_REGISTRY[block.type];
  const isContainer = meta?.allowsChildren ?? false;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({ type: "SELECT_BLOCK", blockId: block.id });
    },
    [dispatch, block.id],
  );

  // ─── Drag & Drop ───────────────────────────────────────────

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      e.dataTransfer.setData("text/plain", block.id);
      e.dataTransfer.effectAllowed = "move";
    },
    [block.id],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const draggedId = e.dataTransfer.getData("text/plain");
      if (draggedId && draggedId !== block.id) {
        dispatch({
          type: "MOVE_BLOCK",
          blockId: draggedId,
          targetParentId: parentId,
          targetIndex: index,
        });
      }
    },
    [dispatch, block.id, parentId, index],
  );

  // ─── Render ────────────────────────────────────────────────

  return (
    <>
      {/* Drop zone before this block */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-1 transition-all ${isDragOver ? "h-2 bg-primary/30 rounded" : ""}`}
      />

      {/* Add button between blocks */}
      <div className="group/add relative flex items-center justify-center py-0.5">
        <button
          onClick={() => onInsert(parentId, index)}
          className="absolute z-10 flex items-center justify-center rounded-full border border-primary/50 bg-white p-0.5 text-primary opacity-0 shadow-sm transition-opacity group-hover/add:opacity-100"
          title="הוסף בלוק"
        >
          <Plus size={14} />
        </button>
        <div className="h-px w-full bg-transparent transition-colors group-hover/add:bg-primary/20" />
      </div>

      {/* Block wrapper */}
      <div
        onClick={handleClick}
        className={`group relative rounded-lg border-2 transition-colors cursor-pointer ${
          isSelected
            ? "border-primary shadow-md shadow-primary/10"
            : "border-transparent hover:border-border"
        }`}
      >
        {/* Drag handle + type label */}
        <div
          className={`absolute -top-3 start-2 z-10 flex items-center gap-1 rounded-md bg-bg-subtle px-1.5 py-0.5 text-xs font-medium transition-opacity ${
            isSelected ? "opacity-100 bg-primary text-primary-fg" : "opacity-0 group-hover:opacity-100 text-fg-muted"
          }`}
        >
          <div
            draggable
            onDragStart={handleDragStart}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={12} />
          </div>
          <span>{meta?.label || block.type}</span>
        </div>

        {/* Block content — rendered in light context (simulating published site) */}
        <div className="rounded-md bg-white p-3 text-gray-900" dir="auto">
          <BlockContent block={block} />

          {/* Render children for container blocks */}
          {isContainer && block.children.length > 0 && (
            <div className={`mt-2 flex ${block.type === "row" ? "flex-row gap-3" : "flex-col"}`}>
              {block.children.map((child, i) => (
                <div key={child.id} className={block.type === "row" ? "flex-1" : ""}>
                  <CanvasBlock
                    block={child}
                    parentId={block.id}
                    index={i}
                    onInsert={onInsert}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Add button inside empty containers */}
          {isContainer && block.children.length === 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onInsert(block.id, 0); }}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <Plus size={16} />
              <span>הוסף בלוק</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
