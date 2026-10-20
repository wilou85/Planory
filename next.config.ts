import type { NextConfig } from "next";
import { INDEXING_REDIRECTS } from "./src/lib/indexing-redirects";
import { LOCALE_REDIRECTS, LOCALE_REWRITES } from "./src/lib/locale-routing";

const nextConfig: NextConfig = {
  async redirects() {
    return [...INDEXING_REDIRECTS, ...LOCALE_REDIRECTS];
  },
  /**
   * afterFiles: public/ assets win first; then unprefixed FR paths rewrite to
   * /fr/… before dynamic `[locale]` can treat the first segment as a locale.
   */
  async rewrites() {
    return {
      afterFiles: [...LOCALE_REWRITES],
    };
  },
};

export default nextConfig;
