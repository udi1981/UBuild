"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

/**
 * Better Auth client for the web dashboard.
 * Uses relative baseURL because Next.js rewrites proxy /api/auth to the API server.
 */
export const authClient = createAuthClient({
  baseURL: "/",
  plugins: [magicLinkClient()],
});

/** Convenience re-exports of commonly used hooks and methods */
export const { useSession, signIn, signUp, signOut } = authClient;
