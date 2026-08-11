import type { MetadataRoute } from "next";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getArticleUpdatedAt, getResourceArticles } from "@/lib/resources";
import { localizePath, type Locale } from "@/lib/i18n";
import { getHreflangLanguages } from "@/lib/seo";
import { SITE_PAGES, SITE_URL } from "@/lib/site";

const LOCALES: readonly Locale[] = ["fr", "en"];

/** Bump when URLs are added/removed so crawlers see a fresh lastmod. */
export const SITEMAP_GENERATED_AT = new Date("2026-08-11T15:30:00.000Z");

function pageUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function sitemapEntry(
  path: string,
  options: {
    lastModified?: Date;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  },
): MetadataRoute.Sitemap[number] {
  return {
    url: pageUrl(path),
    lastModified: options.lastModified ?? SITEMAP_GENERATED_AT,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: getHreflangLanguages(path),
    },
  };
}

/** Shared sitemap entries for Next MetadataRoute + static XML export. */
export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  const add = (entry: MetadataRoute.Sitemap[number]) => {
    byUrl.set(entry.url, entry);
  };

  for (const page of SITE_PAGES) {
    for (const locale of LOCALES) {
      add(
        sitemapEntry(localizePath(page.path, locale), {
          changeFrequency: page.changeFrequency,
          priority: page.priority,
        }),
      );
    }
  }

  for (const locale of LOCALES) {
    for (const article of getResourceArticles(locale)) {
      add(
        sitemapEntry(article.path, {
          lastModified: new Date(getArticleUpdatedAt(article)),
          changeFrequency: "monthly",
          priority: 0.55,
        }),
      );
    }
  }

  for (const magnet of LEAD_MAGNETS) {
    for (const locale of LOCALES) {
      add(
        sitemapEntry(localizePath(magnet.path, locale), {
          changeFrequency: "monthly",
          priority: 0.6,
        }),
      );
    }
  }

  return [...byUrl.values()];
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toIsoDate(value: Date | string | undefined): string {
  if (!value) return SITEMAP_GENERATED_AT.toISOString();
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

/** Serialize sitemap entries to sitemap.org XML (with xhtml hreflang). */
export function serializeSitemapXml(entries: MetadataRoute.Sitemap = buildSitemapEntries()): string {
  const urls = entries
    .map((entry) => {
      const languages = entry.alternates?.languages ?? {};
      const xhtmlLinks = Object.entries(languages)
        .map(
          ([hreflang, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(String(href))}" />`,
        )
        .join("\n");

      return [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>`,
        xhtmlLinks,
        `    <lastmod>${toIsoDate(entry.lastModified)}</lastmod>`,
        entry.changeFrequency
          ? `    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>`
          : null,
        typeof entry.priority === "number" ? `    <priority>${entry.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}
