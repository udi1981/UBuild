import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { createDb } from "@ubuilder/db";
import * as schema from "@ubuilder/db/schema";

/** Drizzle database instance for auth */
const db = createDb();

/**
 * Better Auth server instance.
 * Configured with Drizzle adapter, email/password, Google OAuth, and magic link.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),

  /** Let PostgreSQL generate UUIDs via defaultRandom() */
  advanced: {
    database: {
      generateId: false,
    },
  },

  /** Email + password authentication */
  emailAndPassword: {
    enabled: true,
  },

  /** OAuth providers */
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  /** Custom fields on the user model */
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "owner",
        input: false,
      },
    },
  },

  /** Session configuration */
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh after 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5-minute cookie cache
    },
  },

  /** Trusted frontend origins (localhost + 127.0.0.1 for dev) */
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3001",
    "http://127.0.0.1:3001",
  ],

  /** Plugins */
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // TODO: Integrate with Resend email service
        console.log(`[Magic Link] Send to ${email}: ${url}`);
      },
    }),
  ],
});

/** Inferred auth types for use in middleware and routes */
export type Auth = typeof auth;
