import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Silence the workspace root warning caused by the extra package-lock.json in your home folder
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
