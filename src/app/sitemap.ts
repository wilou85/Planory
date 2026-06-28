import type { MetadataRoute } from "next";
import { LEAD_MAGNETS, TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { RESOURCE_ARTICLES } from "@/lib/resources";
import { getArticleUpdatedAt } from "@/lib/resources";
import { SITE_PAGES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = SITE_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const articles = RESOURCE_ARTICLES.map((article) => ({
    url: `${SITE_URL}${article.path}`,
    lastModified: new Date(getArticleUpdatedAt(article)),
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  const toolsHub = {
    url: `${SITE_URL}${TOOLS_HUB_PATH}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  };

  const leadMagnets = LEAD_MAGNETS.map((magnet) => ({
    url: `${SITE_URL}${magnet.path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...articles, toolsHub, ...leadMagnets];
}
