import type { NextConfig } from "next";
import { LOCALE_REDIRECTS, LOCALE_REWRITES } from "./src/lib/locale-routing";

const nextConfig: NextConfig = {
  async redirects() {
    return [...LOCALE_REDIRECTS];
  },
  async rewrites() {
    return [...LOCALE_REWRITES];
  },
};

export default nextConfig;
