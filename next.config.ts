import type { NextConfig } from "next";
import { LOCALE_REDIRECTS, LOCALE_REWRITES } from "./src/lib/locale-routing";

const nextConfig: NextConfig = {
  async redirects() {
    return [...LOCALE_REDIRECTS];
  },
  /**
   * beforeFiles: must run before `[locale]` matches the first path segment
   * (e.g. /ressources → locale=ressources → 404). afterFiles is too late.
   */
  async rewrites() {
    return {
      beforeFiles: [...LOCALE_REWRITES],
    };
  },
};

export default nextConfig;
