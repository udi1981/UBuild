/**
 * @ubuilder/db — Database package
 * Drizzle ORM schemas, client factory, and type exports.
 */

import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  accounts,
  blocks,
  media,
  pages,
  sessions,
  sites,
  users,
  verifications,
} from "./schema";

// Database client
export { createDb } from "./client";
export type { Database } from "./client";

// All schemas, relations, and enums
export * from "./schema";

// ---- Inferred select types (what you GET from the DB) ----
export type User = InferSelectModel<typeof users>;
export type Site = InferSelectModel<typeof sites>;
export type Page = InferSelectModel<typeof pages>;
export type Block = InferSelectModel<typeof blocks>;
export type Media = InferSelectModel<typeof media>;
export type Session = InferSelectModel<typeof sessions>;
export type Account = InferSelectModel<typeof accounts>;
export type Verification = InferSelectModel<typeof verifications>;

// ---- Inferred insert types (what you WRITE to the DB) ----
export type NewUser = InferInsertModel<typeof users>;
export type NewSite = InferInsertModel<typeof sites>;
export type NewPage = InferInsertModel<typeof pages>;
export type NewBlock = InferInsertModel<typeof blocks>;
export type NewMedia = InferInsertModel<typeof media>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewAccount = InferInsertModel<typeof accounts>;
export type NewVerification = InferInsertModel<typeof verifications>;
