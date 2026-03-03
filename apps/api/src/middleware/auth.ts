import type { Context, Next } from "hono";
import { auth } from "../lib/auth";

/**
 * Hono middleware that requires authentication.
 * Extracts session from cookies/headers and sets user + session on context.
 * Returns 401 if no valid session found.
 */
export const requireAuth = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ ok: false, error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
};

/**
 * Hono middleware that optionally loads session.
 * Does NOT block the request if no session exists.
 * Sets user and session to null if unauthenticated.
 */
export const optionalAuth = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  await next();
};
