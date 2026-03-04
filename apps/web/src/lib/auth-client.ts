"use client";

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

/**
 * Resolve the auth base URL.
 * In the browser: use current origin (avoids localhost vs 127.0.0.1 CORS mismatch).
 * During SSG/SSR: use NEXT_PUBLIC_APP_URL env var (absolute URL required by Better Auth).
 */
const getBaseURL = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
};

/**
 * Better Auth client for the web dashboard.
 * Next.js rewrites proxy /api/auth/* to the API server.
 */
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [magicLinkClient()],
});

/** Convenience re-exports of commonly used hooks and methods */
export const { useSession, signIn, signUp, signOut } = authClient;
