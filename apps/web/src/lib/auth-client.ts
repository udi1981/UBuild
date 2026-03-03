"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

/**
 * Better Auth client for the web dashboard.
 * Uses NEXT_PUBLIC_APP_URL so the client resolves during both SSG and runtime.
 * Next.js rewrites proxy /api/auth/* to the API server.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  plugins: [magicLinkClient()],
});

/** Convenience re-exports of commonly used hooks and methods */
export const { useSession, signIn, signUp, signOut } = authClient;
