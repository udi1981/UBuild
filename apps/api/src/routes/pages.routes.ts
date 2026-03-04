import { createApp } from "../lib/app";
import { requireAuth } from "../middleware/auth";
import { createDb } from "@ubuilder/db";
import type { BlockData, PageSeo } from "@ubuilder/db";
import * as pagesService from "../services/pages.service";

const app = createApp();
const db = createDb();

/** Apply auth middleware to all pages routes */
app.use("/*", requireAuth);

/** GET / — List all pages for a site */
app.get("/", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("siteId")!;

  const result = await pagesService.listPages(db, siteId, userId);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 404);
  }
  return c.json({ ok: true, data: result.data });
});

/** POST / — Create a new page */
app.post("/", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("siteId")!;
  const body = await c.req.json<{
    title?: string;
    slug?: string;
    description?: string;
    blocksData?: BlockData[];
    isHomePage?: boolean;
  }>();

  if (!body.title || body.title.trim().length === 0) {
    return c.json({ ok: false, error: "Page title is required" }, 400);
  }

  const result = await pagesService.createPage(db, siteId, userId, {
    title: body.title.trim(),
    slug: body.slug?.trim(),
    description: body.description?.trim(),
    blocksData: body.blocksData,
    isHomePage: body.isHomePage,
  });

  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 500);
  }
  return c.json({ ok: true, data: result.data }, 201);
});

/** GET /:pageId — Get a single page with blocks */
app.get("/:pageId", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("siteId")!;
  const pageId = c.req.param("pageId")!;

  const result = await pagesService.getPageById(db, pageId, siteId, userId);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 404);
  }
  return c.json({ ok: true, data: result.data });
});

/** PATCH /:pageId — Update page (save blocks, metadata) */
app.patch("/:pageId", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("siteId")!;
  const pageId = c.req.param("pageId")!;
  const body = await c.req.json<{
    title?: string;
    slug?: string;
    description?: string;
    blocksData?: BlockData[];
    seo?: PageSeo;
    sortOrder?: number;
    status?: "draft" | "published" | "archived";
  }>();

  const result = await pagesService.updatePage(db, pageId, siteId, userId, body);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 404);
  }
  return c.json({ ok: true, data: result.data });
});

/** DELETE /:pageId — Delete a page */
app.delete("/:pageId", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("siteId")!;
  const pageId = c.req.param("pageId")!;

  const result = await pagesService.deletePage(db, pageId, siteId, userId);
  if (!result.ok) {
    const status = result.error === "Cannot delete the home page" ? 400 : 404;
    return c.json({ ok: false, error: result.error }, status);
  }
  return c.json({ ok: true, data: result.data });
});

/** POST /:pageId/publish — Publish a page */
app.post("/:pageId/publish", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("siteId")!;
  const pageId = c.req.param("pageId")!;

  const result = await pagesService.publishPage(db, pageId, siteId, userId);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 404);
  }
  return c.json({ ok: true, data: result.data });
});

export { app as pagesRoutes };
