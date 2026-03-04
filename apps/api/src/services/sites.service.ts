import { eq, and, isNull, desc } from "drizzle-orm";
import type { Database, Site } from "@ubuilder/db";
import { sites } from "@ubuilder/db";
import type { Result } from "@ubuilder/types";

type CreateSiteInput = {
  name: string;
  slug?: string;
  description?: string;
  language?: string;
};

type UpdateSiteInput = {
  name?: string;
  description?: string;
  customDomain?: string;
  language?: string;
  favicon?: string;
};

/**
 * Generate a URL-safe slug from a name.
 * Strips non-alphanumeric chars, lowercases, and appends a short unique suffix.
 */
const generateSlug = (name: string): string => {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Date.now().toString(36).slice(-4);
  return base ? `${base}-${suffix}` : `site-${suffix}`;
};

/** List all non-deleted sites for a user, newest first */
export const listSites = async (
  db: Database,
  userId: string,
): Promise<Result<Site[], string>> => {
  const result = await db
    .select()
    .from(sites)
    .where(and(eq(sites.ownerId, userId), isNull(sites.deletedAt)))
    .orderBy(desc(sites.createdAt));
  return { ok: true, data: result };
};

/** Get a single site by ID, verifying ownership */
export const getSiteById = async (
  db: Database,
  siteId: string,
  userId: string,
): Promise<Result<Site, string>> => {
  const result = await db
    .select()
    .from(sites)
    .where(
      and(eq(sites.id, siteId), eq(sites.ownerId, userId), isNull(sites.deletedAt)),
    )
    .limit(1);
  if (result.length === 0) {
    return { ok: false, error: "Site not found" };
  }
  return { ok: true, data: result[0]! };
};

/** Create a new site for a user */
export const createSite = async (
  db: Database,
  userId: string,
  input: CreateSiteInput,
): Promise<Result<Site, string>> => {
  const slug = input.slug || generateSlug(input.name);
  const result = await db
    .insert(sites)
    .values({
      ownerId: userId,
      name: input.name,
      slug,
      description: input.description ?? null,
      language: input.language ?? "he",
    })
    .returning();
  if (result.length === 0) {
    return { ok: false, error: "Failed to create site" };
  }
  return { ok: true, data: result[0]! };
};

/** Update an existing site, verifying ownership */
export const updateSite = async (
  db: Database,
  siteId: string,
  userId: string,
  input: UpdateSiteInput,
): Promise<Result<Site, string>> => {
  const result = await db
    .update(sites)
    .set(input)
    .where(
      and(eq(sites.id, siteId), eq(sites.ownerId, userId), isNull(sites.deletedAt)),
    )
    .returning();
  if (result.length === 0) {
    return { ok: false, error: "Site not found" };
  }
  return { ok: true, data: result[0]! };
};

/** Soft-delete a site by setting deletedAt */
export const deleteSite = async (
  db: Database,
  siteId: string,
  userId: string,
): Promise<Result<{ id: string }, string>> => {
  const result = await db
    .update(sites)
    .set({ deletedAt: new Date() })
    .where(
      and(eq(sites.id, siteId), eq(sites.ownerId, userId), isNull(sites.deletedAt)),
    )
    .returning({ id: sites.id });
  if (result.length === 0) {
    return { ok: false, error: "Site not found" };
  }
  return { ok: true, data: result[0]! };
};
