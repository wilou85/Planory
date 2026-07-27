import type { MetadataRoute } from "next";
import { ARTICLES_EN } from "@/lib/articles-en";
import { LEAD_MAGNETS, TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { getArticleUpdatedAt, getResourceArticles } from "@/lib/resources";
import { localizePath } from "@/lib/i18n";
import { SITE_PAGES, SITE_URL } from "@/lib/site";

const EN_STATIC_PATHS = [
  "/en",
  "/en/produit",
  "/en/secteurs",
  "/en/secteurs/hopital",
  "/en/secteurs/aeroport",
  "/en/secteurs/industrie",
  "/en/offre",
  "/en/faq",
  "/en/contact",
  "/en/ressources",
  "/en/mentions-legales",
  "/en/confidentialite",
  localizePath(TOOLS_HUB_PATH, "en"),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = SITE_PAGES.map(({ path, changeFrequency, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const enPages = EN_STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/en" ? 1 : 0.75,
  }));

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

  return [...pages, ...enPages, ...articles, ...enArticles, ...leadMagnets];
}
