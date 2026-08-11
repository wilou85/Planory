import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildSitemapEntries, serializeSitemapXml } from "@/lib/build-sitemap";

describe("sitemap generate", () => {
  it("writes src/app/sitemap.xml", () => {
    const entries = buildSitemapEntries();
    const xml = serializeSitemapXml(entries);
    const outDir = join(process.cwd(), "src", "app");
    const outPath = join(outDir, "sitemap.xml");

    mkdirSync(outDir, { recursive: true });
    writeFileSync(outPath, xml, "utf8");

    expect(entries.length).toBeGreaterThanOrEqual(50);
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(xml).toContain("<loc>https://www.planory.net</loc>");
  });
});
