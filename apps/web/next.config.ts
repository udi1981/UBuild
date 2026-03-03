import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@ubuilder/ui", "@ubuilder/types", "@ubuilder/utils"],
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),

  /** Proxy all API requests to the Hono backend */
  async rewrites() {
    const apiUrl = process.env.API_URL || "http://localhost:8787";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
