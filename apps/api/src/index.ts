import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { auth } from "./lib/auth";

const app = new Hono();

// Auth-specific CORS — must be before the auth handler
app.use(
  "/api/auth/*",
  cors({
    origin: process.env.BETTER_AUTH_URL || "http://localhost:3001",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// General CORS for other API routes
app.use("/*", cors());

// Mount Better Auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/", (c) => {
  return c.json({ message: "UBuilder AI API", status: "ok" });
});

app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

const port = Number(process.env.PORT) || 8787;

console.log(`API server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
