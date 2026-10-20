import { describe, it } from "vitest";
import { assertInvariant, assertInvariantForEach } from "@/lib/test/invariants";
import { CANONICAL_HOST, INDEXING_REDIRECTS } from "@/lib/indexing-redirects";

const PERMANENT = new Set([301, 308]);

function findRedirect(source: string, host?: string) {
  return INDEXING_REDIRECTS.find(
    (r) =>
      r.source === source &&
      (host === undefined
        ? !("has" in r && r.has)
        : "has" in r && r.has?.some((h) => h.type === "host" && h.value === host)),
  );
}

describe("INDEXING_REDIRECTS", () => {
  describe("invariants", () => {
    it("every indexing redirect is permanent so Google drops the old URL", () => {
      assertInvariantForEach(
        INDEXING_REDIRECTS,
        (r) =>
          ("permanent" in r && r.permanent === true) ||
          ("statusCode" in r && r.statusCode !== undefined && PERMANENT.has(r.statusCode)),
        (r) => `${r.source} must be a 301/308`,
      );
    });

    it("never redirects to the internal /fr prefix or the /en/fr trap", () => {
      assertInvariantForEach(
        INDEXING_REDIRECTS,
        (r) => {
          const path = r.destination.replace(/^https?:\/\/[^/]+/, "") || "/";
          return !/^\/fr(\/|$)/.test(path) && !/^\/en\/fr(\/|$)/.test(path);
        },
        (r) => `${r.source} -> ${r.destination} lands on a non-public URL`,
      );
    });

    it("covers the URLs Google Search Console reported (legacy, locale-prefixed)", () => {
      assertInvariantForEach(
        ["/skynet", "/skynet/:path*", "/fr", "/fr/:path*", "/en/fr", "/en/fr/:path*"],
        (source) => findRedirect(source) !== undefined,
        (source) => `missing redirect for ${source}`,
      );
    });
  });

  it("sends the bare domain to the canonical www host, keeping the path", () => {
    const apex = findRedirect("/:path*", "planory.net");
    assertInvariant(apex !== undefined, "missing apex host redirect");
    assertInvariant(
      apex.destination === `https://${CANONICAL_HOST}/:path*`,
      `apex destination: ${apex.destination}`,
    );
  });
});
