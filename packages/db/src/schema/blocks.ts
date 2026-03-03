import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { sites } from "./sites";

/** Block element type */
export const blockTypeEnum = pgEnum("block_type", [
  "section",
  "row",
  "column",
  "heading",
  "paragraph",
  "rich_text",
  "image",
  "video",
  "icon",
  "button",
  "link",
  "spacer",
  "divider",
  "hero",
  "features",
  "testimonials",
  "faq",
  "cta",
  "footer",
]);

/** Block template data stored as JSONB */
export type BlockTemplateData = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: BlockTemplateData[];
  styles: Record<string, Record<string, string>>;
  responsiveStyles?: {
    tablet?: Record<string, string>;
    mobile?: Record<string, string>;
  };
};

export const blocks = pgTable(
  "blocks",
  {
    id: uuid().primaryKey().defaultRandom(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    siteId: uuid("site_id").references(() => sites.id, {
      onDelete: "set null",
    }),
    name: varchar({ length: 255 }).notNull(),
    description: text(),
    type: blockTypeEnum().notNull(),
    category: varchar({ length: 100 }),
    blockData: jsonb("block_data").$type<BlockTemplateData>().notNull(),
    previewUrl: text("preview_url"),
    isGlobal: integer("is_global").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("blocks_created_by_idx").on(table.createdBy),
    index("blocks_site_id_idx").on(table.siteId),
    index("blocks_type_idx").on(table.type),
    index("blocks_category_idx").on(table.category),
  ],
);

export const blocksRelations = relations(blocks, ({ one }) => ({
  /** The user who created this block template */
  creator: one(users, {
    fields: [blocks.createdBy],
    references: [users.id],
  }),
  /** The site this block belongs to (null = shared across sites) */
  site: one(sites, {
    fields: [blocks.siteId],
    references: [sites.id],
  }),
}));
