import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { pages } from "./pages";
import { media } from "./media";

/** Site theme configuration stored as JSONB */
export type SiteTheme = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
};

/** Site SEO defaults stored as JSONB */
export type SiteSeoDefaults = {
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
};

export const sites = pgTable(
  "sites",
  {
    id: uuid().primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 100 }).notNull().unique(),
    description: text(),
    customDomain: varchar("custom_domain", { length: 255 }),
    subdomain: varchar({ length: 100 }).unique(),
    theme: jsonb().$type<SiteTheme>(),
    seoDefaults: jsonb("seo_defaults").$type<SiteSeoDefaults>(),
    favicon: text(),
    language: varchar({ length: 5 }).default("he").notNull(),
    isPublished: timestamp("is_published", { mode: "date" }),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("sites_owner_id_idx").on(table.ownerId),
    index("sites_slug_idx").on(table.slug),
    index("sites_custom_domain_idx").on(table.customDomain),
    index("sites_subdomain_idx").on(table.subdomain),
  ],
);

export const sitesRelations = relations(sites, ({ one, many }) => ({
  /** The user who owns this site */
  owner: one(users, {
    fields: [sites.ownerId],
    references: [users.id],
  }),
  /** Pages belonging to this site */
  pages: many(pages),
  /** Media files belonging to this site */
  media: many(media),
}));
