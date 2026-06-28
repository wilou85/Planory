import { ARTICLES } from "@/lib/articles";

export type ArticleSection =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "cta"; text: string; href: string; label: string };

export type ResourceArticle = {
  slug: string;
  path: string;
  title: string;
  description: string;
  readTime: string;
  publishedAt: string;
  /** Dernière révision (schema dateModified). Si absent, voir ARTICLE_UPDATED_AT ou publishedAt. */
  updatedAt?: string;
  keywords: string[];
  /** Liens internes SEO vers pages et guides connexes */
  relatedLinks?: { href: string; label: string }[];
  sections: ArticleSection[];
};

/** Révisions éditoriales centralisées pour dateModified (schema + affichage) */
export const ARTICLE_UPDATED_AT: Partial<Record<string, string>> = {
  "planning-social": "2026-06-28",
  "logiciel-planning-equipe": "2026-06-28",
  "planification-rh": "2026-06-28",
  "gestion-astreintes": "2026-06-28",
  "planning-hospitalier": "2026-06-28",
  "planning-12h-hopital": "2026-06-28",
  "planning-excel-equipe": "2026-06-28",
  "travail-nuit-planning-2x8": "2026-06-28",
  "planning-medical": "2026-06-28",
  "planification-industrielle": "2026-06-28",
};

export function getArticleUpdatedAt(article: ResourceArticle): string {
  return ARTICLE_UPDATED_AT[article.slug] ?? article.updatedAt ?? article.publishedAt;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatArticleDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T12:00:00`));
}

export const RESOURCE_ARTICLES: ResourceArticle[] = ARTICLES;

export function getResourceArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
