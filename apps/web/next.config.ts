import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@ubuilder/ui", "@ubuilder/types", "@ubuilder/utils"],
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),

  /** Proxy auth requests to the API server to avoid cross-origin cookie issues */
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.API_URL || "http://localhost:8787"}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
