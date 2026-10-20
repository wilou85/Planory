import { localizePath } from "@/lib/i18n";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getArticleUpdatedAt, RESOURCE_ARTICLES } from "@/lib/resources";
import { getHreflangLanguages } from "@/lib/seo";
import { SITE_PAGES, SITE_URL, type SitePage } from "@/lib/site";

/** Last editorial revision of the main pages (bump when their content changes). */
export const PAGES_LAST_MODIFIED = "2026-10-20T00:00:00.000Z";
/** Last revision of the lead-magnet tool pages. */
export const TOOLS_LAST_MODIFIED = "2026-08-11T15:30:00.000Z";

export type SitemapEntry = {
  loc: string;
  alternates: ReturnType<typeof getHreflangLanguages>;
  lastmod: string;
  changefreq: SitePage["changeFrequency"];
  priority: number;
};

function absolute(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function bothLocales(
  frPath: string,
  meta: Omit<SitemapEntry, "loc" | "alternates">,
): SitemapEntry[] {
  const alternates = getHreflangLanguages(frPath);
  return [frPath, localizePath(frPath, "en")].map((path) => ({
    loc: absolute(path),
    alternates,
    ...meta,
  }));
}

export function buildSitemapEntries(): SitemapEntry[] {
  const pages = SITE_PAGES.flatMap((page) =>
    bothLocales(page.path, {
      lastmod: PAGES_LAST_MODIFIED,
      changefreq: page.changeFrequency,
      priority: page.priority,
    }),
  );

  const articleMeta = (slug: string) => {
    const article = RESOURCE_ARTICLES.find((a) => a.slug === slug)!;
    return {
      lastmod: new Date(`${getArticleUpdatedAt(article)}T00:00:00.000Z`).toISOString(),
      changefreq: "monthly" as const,
      priority: 0.55,
    };
  };
  const articlesFr = RESOURCE_ARTICLES.map((a) => bothLocales(a.path, articleMeta(a.slug))[0]);
  const articlesEn = RESOURCE_ARTICLES.map((a) => bothLocales(a.path, articleMeta(a.slug))[1]);

  const tools = LEAD_MAGNETS.flatMap((magnet) =>
    bothLocales(magnet.path, {
      lastmod: TOOLS_LAST_MODIFIED,
      changefreq: "monthly",
      priority: 0.6,
    }),
  );

  return [...pages, ...articlesFr, ...articlesEn, ...tools];
}

export function buildSitemapXml(entries: SitemapEntry[] = buildSitemapEntries()): string {
  const urls = entries.map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <xhtml:link rel="alternate" hreflang="fr-FR" href="${e.alternates["fr-FR"]}" />
    <xhtml:link rel="alternate" hreflang="en-GB" href="${e.alternates["en-GB"]}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${e.alternates["x-default"]}" />
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}
