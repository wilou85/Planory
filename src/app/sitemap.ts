import type { MetadataRoute } from "next";
import { ARTICLES_EN } from "@/lib/articles-en";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getArticleUpdatedAt, getResourceArticles } from "@/lib/resources";
import { localizePath } from "@/lib/i18n";
import { SITE_PAGES, SITE_URL } from "@/lib/site";

function pageUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = SITE_PAGES.flatMap(({ path, changeFrequency, priority }) => [
    {
      url: pageUrl(path),
      lastModified: new Date(),
      changeFrequency,
      priority,
    },
    {
      url: `${SITE_URL}${localizePath(path, "en")}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    },
  ]);

  const articles = getResourceArticles("fr").map((article) => ({
    url: `${SITE_URL}${article.path}`,
    lastModified: new Date(getArticleUpdatedAt(article)),
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const enArticles = ARTICLES_EN.map((article) => ({
    url: `${SITE_URL}${article.path}`,
    lastModified: new Date(getArticleUpdatedAt(article)),
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const leadMagnets = LEAD_MAGNETS.flatMap((magnet) => [
    {
      url: `${SITE_URL}${magnet.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}${localizePath(magnet.path, "en")}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  return [...pages, ...articles, ...enArticles, ...leadMagnets];
}
