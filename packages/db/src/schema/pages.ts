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
import { sites } from "./sites";

/** Page publication status */
export const pageStatusEnum = pgEnum("page_status", [
  "draft",
  "published",
  "archived",
]);

/** A single block in the page block tree (stored in JSONB) */
export type BlockData = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children: BlockData[];
  styles: Record<string, Record<string, string>>;
  responsiveStyles?: {
    tablet?: Record<string, string>;
    mobile?: Record<string, string>;
  };
};

/** Page SEO metadata stored as JSONB */
export type PageSeo = {
  title?: string;
  description?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export const pages = pgTable(
  "pages",
  {
    id: uuid().primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    title: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    description: text(),
    status: pageStatusEnum().default("draft").notNull(),
    blocksData: jsonb("blocks_data").$type<BlockData[]>().default([]).notNull(),
    seo: jsonb().$type<PageSeo>(),
    sortOrder: integer("sort_order").default(0).notNull(),
    isHomePage: integer("is_home_page").default(0).notNull(),
    publishedAt: timestamp("published_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("pages_site_id_idx").on(table.siteId),
    index("pages_site_slug_idx").on(table.siteId, table.slug),
    index("pages_status_idx").on(table.status),
  ],
);

export const pagesRelations = relations(pages, ({ one }) => ({
  /** The site this page belongs to */
  site: one(sites, {
    fields: [pages.siteId],
    references: [sites.id],
  }),
}));
