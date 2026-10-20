import type { NextConfig } from "next";

type Redirect = NonNullable<Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>>[number];

export const CANONICAL_HOST = "www.planory.net";

/**
 * Listed before the locale redirects. 301 tells Google the bare domain, the
 * prefixed and the legacy URLs are gone for good.
 */
export const INDEXING_REDIRECTS: Redirect[] = [
  {
    source: "/:path*",
    has: [{ type: "host", value: "planory.net" }],
    destination: `https://${CANONICAL_HOST}/:path*`,
    statusCode: 301,
  },
  { source: "/skynet", destination: "/produit", statusCode: 301 },
  { source: "/skynet/:path*", destination: "/produit", statusCode: 301 },
  { source: "/en/fr", destination: "/en", statusCode: 301 },
  { source: "/en/fr/:path*", destination: "/en/:path*", statusCode: 301 },
  { source: "/fr", destination: "/", statusCode: 301 },
  { source: "/fr/:path*", destination: "/:path*", statusCode: 301 },
];
