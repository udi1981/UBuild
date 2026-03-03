import { Hono } from "hono";

/** Hono variable types available after auth middleware */
type AuthVariables = {
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null;
    emailVerified: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

/**
 * Creates a typed Hono app instance with auth variable types.
 * Use this factory for all route groups that use auth middleware.
 */
export const createApp = () => new Hono<{ Variables: AuthVariables }>();

/** Type alias for the app instance */
export type App = ReturnType<typeof createApp>;
