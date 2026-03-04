/**
 * Block tree utility functions — pure helpers for immutable tree operations.
 */

import type { Block, BlockType, BlockPropsMap } from "@ubuilder/types";

/** Generate a random block ID */
export const generateBlockId = (): string => crypto.randomUUID();

/** Default props for each block type */
const DEFAULT_PROPS: BlockPropsMap = {
  section: { fullWidth: false },
  row: { gap: "16px", wrap: true },
  column: { span: 6 },
  heading: { content: "כותרת חדשה", level: 2, alignment: "start" },
  paragraph: { content: "טקסט פסקה חדש. לחץ כדי לערוך.", alignment: "start" },
  rich_text: { html: "<p>טקסט עשיר</p>" },
  image: { src: "", alt: "תמונה", width: 800, height: 400, objectFit: "cover" },
  video: { src: "", controls: true, autoplay: false, loop: false, muted: false },
  icon: { name: "Star", size: 24, color: "currentColor" },
  button: { text: "כפתור", variant: "primary", size: "md" },
  link: { text: "קישור", href: "#" },
  spacer: { height: "48px" },
  divider: { thickness: "1px", width: "100%" },
  hero: { title: "כותרת ראשית", subtitle: "תיאור קצר", ctaText: "התחל עכשיו", alignment: "center" },
  features: { title: "התכונות שלנו", items: [{ title: "תכונה 1", description: "תיאור התכונה", icon: "Star" }, { title: "תכונה 2", description: "תיאור התכונה", icon: "Zap" }, { title: "תכונה 3", description: "תיאור התכונה", icon: "Shield" }], columns: 3 },
  testimonials: { title: "מה הלקוחות אומרים", items: [{ name: "ישראל כהן", content: "שירות מעולה!", rating: 5 }] },
  faq: { title: "שאלות נפוצות", items: [{ question: "שאלה ראשונה?", answer: "תשובה ראשונה." }] },
  cta: { title: "מוכנים להתחיל?", description: "הצטרפו עוד היום", buttonText: "הרשמה", buttonHref: "#", alignment: "center" },
  footer: { copyright: "© 2026 כל הזכויות שמורות" },
};

/** Create a new block with default props */
export const createBlock = (type: BlockType): Block => {
  const children: Block[] = [];

  // Layout blocks start with an example child
  if (type === "section") {
    children.push(createBlock("heading"), createBlock("paragraph"));
  } else if (type === "row") {
    children.push(createBlock("column"), createBlock("column"));
  }

  return {
    id: generateBlockId(),
    type,
    props: { ...DEFAULT_PROPS[type] },
    children,
    styles: {},
    responsiveStyles: undefined,
  } as Block;
};

/** Find a block in the tree by ID (depth-first) */
export const findBlock = (blocks: Block[], id: string): Block | null => {
  for (const block of blocks) {
    if (block.id === id) return block;
    const found = findBlock(block.children, id);
    if (found) return found;
  }
  return null;
};

/** Find the parent of a block by the block's ID */
export const findParent = (
  blocks: Block[],
  blockId: string,
): { parent: Block[] | null; index: number } => {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i]!.id === blockId) {
      return { parent: null, index: i }; // top-level
    }
    const result = findParentInChildren(blocks[i]!, blockId);
    if (result) return result;
  }
  return { parent: null, index: -1 };
};

const findParentInChildren = (
  parent: Block,
  blockId: string,
): { parent: Block[] | null; index: number } | null => {
  for (let i = 0; i < parent.children.length; i++) {
    if (parent.children[i]!.id === blockId) {
      return { parent: parent.children, index: i };
    }
    const result = findParentInChildren(parent.children[i]!, blockId);
    if (result) return result;
  }
  return null;
};

/** Add a block to the tree at a specific position */
export const addBlock = (
  blocks: Block[],
  parentId: string | null,
  index: number,
  newBlock: Block,
): Block[] => {
  if (parentId === null) {
    // Insert at top level
    const result = [...blocks];
    result.splice(index, 0, newBlock);
    return result;
  }

  return blocks.map((block) => {
    if (block.id === parentId) {
      const newChildren = [...block.children];
      newChildren.splice(index, 0, newBlock);
      return { ...block, children: newChildren };
    }
    if (block.children.length > 0) {
      return { ...block, children: addBlock(block.children, parentId, index, newBlock) };
    }
    return block;
  });
};

/** Remove a block from the tree by ID */
export const removeBlock = (blocks: Block[], blockId: string): Block[] => {
  return blocks
    .filter((block) => block.id !== blockId)
    .map((block) => ({
      ...block,
      children: removeBlock(block.children, blockId),
    }));
};

/** Move a block to a new position in the tree */
export const moveBlock = (
  blocks: Block[],
  blockId: string,
  targetParentId: string | null,
  targetIndex: number,
): Block[] => {
  const block = findBlock(blocks, blockId);
  if (!block) return blocks;

  // Remove from current position
  const withoutBlock = removeBlock(blocks, blockId);

  // Add to new position
  return addBlock(withoutBlock, targetParentId, targetIndex, block);
};

/** Update a block's props immutably */
export const updateBlockProps = (
  blocks: Block[],
  blockId: string,
  newProps: Record<string, unknown>,
): Block[] => {
  return blocks.map((block) => {
    if (block.id === blockId) {
      return { ...block, props: { ...block.props, ...newProps } };
    }
    if (block.children.length > 0) {
      return { ...block, children: updateBlockProps(block.children, blockId, newProps) };
    }
    return block;
  });
};

/** Flatten a block tree into a single array */
export const flattenBlocks = (blocks: Block[]): Block[] => {
  const result: Block[] = [];
  for (const block of blocks) {
    result.push(block);
    if (block.children.length > 0) {
      result.push(...flattenBlocks(block.children));
    }
  }
  return result;
};
