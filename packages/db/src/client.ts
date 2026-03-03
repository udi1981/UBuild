import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Creates a Drizzle database client connected to Neon serverless PostgreSQL.
 * Uses HTTP driver for stateless, serverless-friendly queries.
 */
export const createDb = (url?: string) => {
  const connectionUrl = url ?? process.env.DATABASE_URL;
  if (!connectionUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const sql = neon(connectionUrl);
  return drizzle(sql, { schema });
};

/** Type alias for the database client instance */
export type Database = ReturnType<typeof createDb>;
