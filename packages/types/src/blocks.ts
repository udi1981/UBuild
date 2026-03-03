/**
 * Block Type System for UBuilder AI
 *
 * Defines the strongly-typed block tree structure used throughout the platform.
 * All 18 block types with typed props, categories, and a registry for the editor UI.
 *
 * Aligns with the DB enum in packages/db/src/schema/blocks.ts (blockTypeEnum).
 * See ARCHITECTURE.md ADR-001 for design rationale.
 */

// ─── Block Type Union ───────────────────────────────────────────

/** All available block types — matches the Postgres block_type enum exactly */
export type BlockType =
  // Layout
  | "section"
  | "row"
  | "column"
  // Text
  | "heading"
  | "paragraph"
  | "rich_text"
  // Media
  | "image"
  | "video"
  | "icon"
  // Interactive
  | "button"
  | "link"
  // Utility
  | "spacer"
  | "divider"
  // Composite
  | "hero"
  | "features"
  | "testimonials"
  | "faq"
  | "cta"
  | "footer";

// ─── Style Types ────────────────────────────────────────────────

/** CSS key-value pairs (e.g. { "color": "#fff", "padding": "16px" }) */
export type StyleMap = Record<string, string>;

/** Breakpoint-specific style overrides */
export type ResponsiveStyles = {
  tablet?: StyleMap;
  mobile?: StyleMap;
};

// ─── Text Alignment ─────────────────────────────────────────────

/** Text/content alignment — uses logical values for RTL support */
export type Alignment = "start" | "center" | "end";

// ─── Layout Block Props ─────────────────────────────────────────

/** Full-width section container */
export type SectionProps = {
  backgroundColor?: string;
  padding?: string;
  maxWidth?: string;
  fullWidth?: boolean;
};

/** Horizontal row with flex layout */
export type RowProps = {
  gap?: string;
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
};

/** Column within a row — span is out of 12 columns */
export type ColumnProps = {
  span?: number;
  alignSelf?: "start" | "center" | "end" | "stretch";
};

// ─── Text Block Props ───────────────────────────────────────────

/** Heading levels 1-6 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Heading block (h1–h6) */
export type HeadingProps = {
  content: string;
  level: HeadingLevel;
  alignment?: Alignment;
};

/** Simple text paragraph */
export type ParagraphProps = {
  content: string;
  alignment?: Alignment;
};

/** Rich text with HTML content */
export type RichTextProps = {
  html: string;
};

// ─── Media Block Props ──────────────────────────────────────────

/** Image block */
export type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: "cover" | "contain" | "fill" | "none";
};

/** Video block (embed or self-hosted) */
export type VideoProps = {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
};

/** Icon block (lucide icon name) */
export type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

// ─── Interactive Block Props ────────────────────────────────────

/** Button variant styles */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

/** Button size options */
export type ButtonSize = "sm" | "md" | "lg";

/** Clickable button block */
export type ButtonBlockProps = {
  text: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  openInNewTab?: boolean;
};

/** Text link block */
export type LinkProps = {
  text: string;
  href: string;
  openInNewTab?: boolean;
};

// ─── Utility Block Props ────────────────────────────────────────

/** Vertical spacer */
export type SpacerProps = {
  height: string;
};

/** Horizontal divider line */
export type DividerProps = {
  color?: string;
  thickness?: string;
  width?: string;
};

// ─── Composite Block Sub-Types ──────────────────────────────────

/** Single feature item in a features block */
export type FeatureItem = {
  icon?: string;
  title: string;
  description: string;
};

/** Single testimonial in a testimonials block */
export type TestimonialItem = {
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
};

/** Single FAQ item */
export type FaqItem = {
  question: string;
  answer: string;
};

/** Footer navigation link */
export type FooterLink = {
  label: string;
  href: string;
};

/** Social media link */
export type SocialLink = {
  platform: string;
  href: string;
  icon?: string;
};

// ─── Composite Block Props ──────────────────────────────────────

/** Hero section with title, CTA, and optional background */
export type HeroProps = {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
  alignment?: Alignment;
};

/** Features grid section */
export type FeaturesProps = {
  title?: string;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
};

/** Testimonials carousel/grid */
export type TestimonialsProps = {
  title?: string;
  items: TestimonialItem[];
};

/** FAQ accordion section */
export type FaqProps = {
  title?: string;
  items: FaqItem[];
};

/** Call-to-action banner */
export type CtaProps = {
  title: string;
  description?: string;
  buttonText: string;
  buttonHref: string;
  alignment?: Alignment;
};

/** Page footer with links and social */
export type FooterProps = {
  copyright?: string;
  links?: FooterLink[];
  socialLinks?: SocialLink[];
};

// ─── Block Props Map (Discriminated Union Key) ──────────────────

/** Maps each block type to its typed props */
export type BlockPropsMap = {
  // Layout
  section: SectionProps;
  row: RowProps;
  column: ColumnProps;
  // Text
  heading: HeadingProps;
  paragraph: ParagraphProps;
  rich_text: RichTextProps;
  // Media
  image: ImageProps;
  video: VideoProps;
  icon: IconProps;
  // Interactive
  button: ButtonBlockProps;
  link: LinkProps;
  // Utility
  spacer: SpacerProps;
  divider: DividerProps;
  // Composite
  hero: HeroProps;
  features: FeaturesProps;
  testimonials: TestimonialsProps;
  faq: FaqProps;
  cta: CtaProps;
  footer: FooterProps;
};

// ─── Block Type ─────────────────────────────────────────────────

/** A single block in the page block tree */
export type Block<T extends BlockType = BlockType> = {
  id: string;
  type: T;
  props: T extends keyof BlockPropsMap ? BlockPropsMap[T] : Record<string, unknown>;
  children: Block[];
  styles: StyleMap;
  responsiveStyles?: ResponsiveStyles;
};

// ─── Block Categories ───────────────────────────────────────────

/** Block category for UI grouping */
export type BlockCategory =
  | "layout"
  | "text"
  | "media"
  | "interactive"
  | "utility"
  | "composite";

/** Blocks grouped by category */
export const BLOCK_CATEGORIES: Record<BlockCategory, readonly BlockType[]> = {
  layout: ["section", "row", "column"],
  text: ["heading", "paragraph", "rich_text"],
  media: ["image", "video", "icon"],
  interactive: ["button", "link"],
  utility: ["spacer", "divider"],
  composite: ["hero", "features", "testimonials", "faq", "cta", "footer"],
} as const;

// ─── Block Metadata & Registry ──────────────────────────────────

/** Metadata for a block type — used by the block library and editor UI */
export type BlockMeta = {
  type: BlockType;
  label: string;
  labelEn: string;
  category: BlockCategory;
  icon: string;
  allowsChildren: boolean;
};

/** Registry of all block types with metadata */
export const BLOCK_REGISTRY: Record<BlockType, BlockMeta> = {
  // Layout
  section: {
    type: "section",
    label: "מקטע",
    labelEn: "Section",
    category: "layout",
    icon: "LayoutTemplate",
    allowsChildren: true,
  },
  row: {
    type: "row",
    label: "שורה",
    labelEn: "Row",
    category: "layout",
    icon: "Columns",
    allowsChildren: true,
  },
  column: {
    type: "column",
    label: "עמודה",
    labelEn: "Column",
    category: "layout",
    icon: "SquareSplitVertical",
    allowsChildren: true,
  },

  // Text
  heading: {
    type: "heading",
    label: "כותרת",
    labelEn: "Heading",
    category: "text",
    icon: "Heading",
    allowsChildren: false,
  },
  paragraph: {
    type: "paragraph",
    label: "פסקה",
    labelEn: "Paragraph",
    category: "text",
    icon: "Type",
    allowsChildren: false,
  },
  rich_text: {
    type: "rich_text",
    label: "טקסט עשיר",
    labelEn: "Rich Text",
    category: "text",
    icon: "FileText",
    allowsChildren: false,
  },

  // Media
  image: {
    type: "image",
    label: "תמונה",
    labelEn: "Image",
    category: "media",
    icon: "Image",
    allowsChildren: false,
  },
  video: {
    type: "video",
    label: "וידאו",
    labelEn: "Video",
    category: "media",
    icon: "Video",
    allowsChildren: false,
  },
  icon: {
    type: "icon",
    label: "אייקון",
    labelEn: "Icon",
    category: "media",
    icon: "Star",
    allowsChildren: false,
  },

  // Interactive
  button: {
    type: "button",
    label: "כפתור",
    labelEn: "Button",
    category: "interactive",
    icon: "MousePointerClick",
    allowsChildren: false,
  },
  link: {
    type: "link",
    label: "קישור",
    labelEn: "Link",
    category: "interactive",
    icon: "Link",
    allowsChildren: false,
  },

  // Utility
  spacer: {
    type: "spacer",
    label: "רווח",
    labelEn: "Spacer",
    category: "utility",
    icon: "Minus",
    allowsChildren: false,
  },
  divider: {
    type: "divider",
    label: "קו הפרדה",
    labelEn: "Divider",
    category: "utility",
    icon: "SeparatorHorizontal",
    allowsChildren: false,
  },

  // Composite
  hero: {
    type: "hero",
    label: "הירו",
    labelEn: "Hero",
    category: "composite",
    icon: "Rocket",
    allowsChildren: false,
  },
  features: {
    type: "features",
    label: "תכונות",
    labelEn: "Features",
    category: "composite",
    icon: "Grid3x3",
    allowsChildren: false,
  },
  testimonials: {
    type: "testimonials",
    label: "המלצות",
    labelEn: "Testimonials",
    category: "composite",
    icon: "Quote",
    allowsChildren: false,
  },
  faq: {
    type: "faq",
    label: "שאלות נפוצות",
    labelEn: "FAQ",
    category: "composite",
    icon: "HelpCircle",
    allowsChildren: false,
  },
  cta: {
    type: "cta",
    label: "קריאה לפעולה",
    labelEn: "Call to Action",
    category: "composite",
    icon: "Megaphone",
    allowsChildren: false,
  },
  footer: {
    type: "footer",
    label: "פוטר",
    labelEn: "Footer",
    category: "composite",
    icon: "PanelBottom",
    allowsChildren: false,
  },
} as const;
