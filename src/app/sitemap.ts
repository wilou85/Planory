import type { MetadataRoute } from "next";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getArticleUpdatedAt, getResourceArticles } from "@/lib/resources";
import { localizePath, type Locale } from "@/lib/i18n";
import { getHreflangLanguages } from "@/lib/seo";
import { SITE_PAGES, SITE_URL } from "@/lib/site";

const LOCALES: readonly Locale[] = ["fr", "en"];

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
    lastModified: options.lastModified ?? new Date(),
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: {
      languages: getHreflangLanguages(path),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
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
