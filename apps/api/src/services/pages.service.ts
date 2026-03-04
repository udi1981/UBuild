import { eq, and, isNull, asc } from "drizzle-orm";
import type { Database, Page } from "@ubuilder/db";
import { pages, sites } from "@ubuilder/db";
import type { BlockData, PageSeo } from "@ubuilder/db";
import type { Result } from "@ubuilder/types";

type CreatePageInput = {
  title: string;
  slug?: string;
  description?: string;
  blocksData?: BlockData[];
  isHomePage?: boolean;
};

type UpdatePageInput = {
  title?: string;
  slug?: string;
  description?: string;
  blocksData?: BlockData[];
  seo?: PageSeo;
  sortOrder?: number;
  status?: "draft" | "published" | "archived";
};

/**
 * Generate a URL-safe slug from a title.
 * Strips non-alphanumeric chars, lowercases, appends unique suffix.
 */
const generateSlug = (title: string): string => {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Date.now().toString(36).slice(-4);
  return base ? `${base}-${suffix}` : `page-${suffix}`;
};

/**
 * Verify that a site exists and belongs to the given user.
 * Returns the site ID on success, error message on failure.
 */
const verifySiteOwnership = async (
  db: Database,
  siteId: string,
  userId: string,
): Promise<Result<string, string>> => {
  const result = await db
    .select({ id: sites.id })
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.ownerId, userId), isNull(sites.deletedAt)))
    .limit(1);
  if (result.length === 0) {
    return { ok: false, error: "Site not found" };
  }
  return { ok: true, data: result[0]!.id };
};

/** List all pages for a site (without blocksData for performance) */
export const listPages = async (
  db: Database,
  siteId: string,
  userId: string,
): Promise<Result<Omit<Page, "blocksData">[], string>> => {
  const siteCheck = await verifySiteOwnership(db, siteId, userId);
  if (!siteCheck.ok) return siteCheck;

  const result = await db
    .select({
      id: pages.id,
      siteId: pages.siteId,
      title: pages.title,
      slug: pages.slug,
      description: pages.description,
      status: pages.status,
      seo: pages.seo,
      sortOrder: pages.sortOrder,
      isHomePage: pages.isHomePage,
      publishedAt: pages.publishedAt,
      createdAt: pages.createdAt,
      updatedAt: pages.updatedAt,
    })
    .from(pages)
    .where(eq(pages.siteId, siteId))
    .orderBy(asc(pages.sortOrder), asc(pages.createdAt));

  return { ok: true, data: result };
};

/** Get a single page by ID with full blocksData */
export const getPageById = async (
  db: Database,
  pageId: string,
  siteId: string,
  userId: string,
): Promise<Result<Page, string>> => {
  const siteCheck = await verifySiteOwnership(db, siteId, userId);
  if (!siteCheck.ok) return siteCheck;

  const result = await db
    .select()
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.siteId, siteId)))
    .limit(1);

  if (result.length === 0) {
    return { ok: false, error: "Page not found" };
  }
  return { ok: true, data: result[0]! };
};

/** Create a new page for a site */
export const createPage = async (
  db: Database,
  siteId: string,
  userId: string,
  input: CreatePageInput,
): Promise<Result<Page, string>> => {
  const siteCheck = await verifySiteOwnership(db, siteId, userId);
  if (!siteCheck.ok) return siteCheck;

  const slug = input.slug || generateSlug(input.title);
  const result = await db
    .insert(pages)
    .values({
      siteId,
      title: input.title,
      slug,
      description: input.description ?? null,
      blocksData: input.blocksData ?? [],
      isHomePage: input.isHomePage ? 1 : 0,
      status: "draft",
    })
    .returning();

  if (result.length === 0) {
    return { ok: false, error: "Failed to create page" };
  }
  return { ok: true, data: result[0]! };
};

/** Update an existing page (save blocks, metadata, etc.) */
export const updatePage = async (
  db: Database,
  pageId: string,
  siteId: string,
  userId: string,
  input: UpdatePageInput,
): Promise<Result<Page, string>> => {
  const siteCheck = await verifySiteOwnership(db, siteId, userId);
  if (!siteCheck.ok) return siteCheck;

  // Build the update object, only including provided fields
  const updateData: Record<string, unknown> = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.blocksData !== undefined) updateData.blocksData = input.blocksData;
  if (input.seo !== undefined) updateData.seo = input.seo;
  if (input.sortOrder !== undefined) updateData.sortOrder = input.sortOrder;
  if (input.status !== undefined) updateData.status = input.status;

  const result = await db
    .update(pages)
    .set(updateData)
    .where(and(eq(pages.id, pageId), eq(pages.siteId, siteId)))
    .returning();

  if (result.length === 0) {
    return { ok: false, error: "Page not found" };
  }
  return { ok: true, data: result[0]! };
};

/** Delete a page (hard delete). Prevents deleting the home page. */
export const deletePage = async (
  db: Database,
  pageId: string,
  siteId: string,
  userId: string,
): Promise<Result<{ id: string }, string>> => {
  const siteCheck = await verifySiteOwnership(db, siteId, userId);
  if (!siteCheck.ok) return siteCheck;

  // Check if it's the home page
  const page = await db
    .select({ id: pages.id, isHomePage: pages.isHomePage })
    .from(pages)
    .where(and(eq(pages.id, pageId), eq(pages.siteId, siteId)))
    .limit(1);

  if (page.length === 0) {
    return { ok: false, error: "Page not found" };
  }
  if (page[0]!.isHomePage === 1) {
    return { ok: false, error: "Cannot delete the home page" };
  }

  await db
    .delete(pages)
    .where(and(eq(pages.id, pageId), eq(pages.siteId, siteId)));

  return { ok: true, data: { id: pageId } };
};

/** Publish a page — set status to published and record timestamp */
export const publishPage = async (
  db: Database,
  pageId: string,
  siteId: string,
  userId: string,
): Promise<Result<Page, string>> => {
  const siteCheck = await verifySiteOwnership(db, siteId, userId);
  if (!siteCheck.ok) return siteCheck;

  const result = await db
    .update(pages)
    .set({
      status: "published",
      publishedAt: new Date(),
    })
    .where(and(eq(pages.id, pageId), eq(pages.siteId, siteId)))
    .returning();

  if (result.length === 0) {
    return { ok: false, error: "Page not found" };
  }
  return { ok: true, data: result[0]! };
};
