import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { sites } from "./sites";

export const media = pgTable(
  "media",
  {
    id: uuid().primaryKey().defaultRandom(),
    uploadedBy: uuid("uploaded_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    siteId: uuid("site_id").references(() => sites.id, {
      onDelete: "set null",
    }),
    fileName: varchar("file_name", { length: 255 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    fileSize: integer("file_size").notNull(),
    url: text().notNull(),
    thumbnailUrl: text("thumbnail_url"),
    altText: varchar("alt_text", { length: 500 }),
    width: integer(),
    height: integer(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("media_uploaded_by_idx").on(table.uploadedBy),
    index("media_site_id_idx").on(table.siteId),
    index("media_mime_type_idx").on(table.mimeType),
  ],
);

export const mediaRelations = relations(media, ({ one }) => ({
  /** The user who uploaded this file */
  uploader: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
  /** The site this media belongs to */
  site: one(sites, {
    fields: [media.siteId],
    references: [sites.id],
  }),
}));
