import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

const app = new Hono();

app.use("/*", cors());

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
