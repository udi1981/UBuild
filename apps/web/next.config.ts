import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@ubuilder/ui", "@ubuilder/types", "@ubuilder/utils"],
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
};

export default nextConfig;
