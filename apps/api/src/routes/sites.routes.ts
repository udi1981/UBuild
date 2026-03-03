import { createApp } from "../lib/app";
import { requireAuth } from "../middleware/auth";
import { createDb } from "@ubuilder/db";
import * as sitesService from "../services/sites.service";

const app = createApp();
const db = createDb();

/** Apply auth middleware to all sites routes */
app.use("/*", requireAuth);

/** GET / — List all sites for the authenticated user */
app.get("/", async (c) => {
  const userId = c.get("user")!.id;
  const result = await sitesService.listSites(db, userId);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 500);
  }
  return c.json({ ok: true, data: result.data });
});

/** POST / — Create a new site */
app.post("/", async (c) => {
  const userId = c.get("user")!.id;
  const body = await c.req.json<{ name?: string; description?: string; language?: string }>();

  if (!body.name || body.name.trim().length === 0) {
    return c.json({ ok: false, error: "Site name is required" }, 400);
  }

  const result = await sitesService.createSite(db, userId, {
    name: body.name.trim(),
    description: body.description?.trim(),
    language: body.language,
  });

  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 500);
  }
  return c.json({ ok: true, data: result.data }, 201);
});

/** GET /:id — Get a single site by ID */
app.get("/:id", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("id");

  const result = await sitesService.getSiteById(db, siteId, userId);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 404);
  }
  return c.json({ ok: true, data: result.data });
});

/** PATCH /:id — Update site fields */
app.patch("/:id", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("id");
  const body = await c.req.json<{
    name?: string;
    description?: string;
    customDomain?: string;
    language?: string;
    favicon?: string;
  }>();

  const result = await sitesService.updateSite(db, siteId, userId, body);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 404);
  }
  return c.json({ ok: true, data: result.data });
});

/** DELETE /:id — Soft-delete a site */
app.delete("/:id", async (c) => {
  const userId = c.get("user")!.id;
  const siteId = c.req.param("id");

  const result = await sitesService.deleteSite(db, siteId, userId);
  if (!result.ok) {
    return c.json({ ok: false, error: result.error }, 404);
  }
  return c.json({ ok: true, data: result.data });
});

export { app as sitesRoutes };
