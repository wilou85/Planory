import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ResourceArticleContent } from "@/components/ResourceArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { getArticleUpdatedAt, getResourceArticle, getResourceArticles } from "@/lib/resources";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const RESOURCES_LABEL: Record<Locale, string> = { fr: "Articles", en: "Blogs" };

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams().flatMap(({ locale }) =>
    getResourceArticles(locale).map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = parseLocaleParam(rawLocale);
  const article = getResourceArticle(slug, locale);
  if (!article) return {};

  const meta = createPageMetadata({
    path: article.path,
    title: `${article.title} | Planory`,
    description: article.description,
    keywords: article.keywords,
  });

  if (locale === "fr") return meta;

  const frArticle = getResourceArticle(slug, "fr");
  return {
    ...meta,
    alternates: {
      canonical: `${SITE_URL}${article.path}`,
      languages: {
        "fr-FR": frArticle ? `${SITE_URL}${frArticle.path}` : `${SITE_URL}/ressources`,
        "en-GB": `${SITE_URL}${article.path}`,
        "x-default": frArticle ? `${SITE_URL}${frArticle.path}` : `${SITE_URL}/ressources`,
      },
    },
  };
}

export default async function ResourceArticlePage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = parseLocaleParam(rawLocale);
  const article = getResourceArticle(slug, locale);
  if (!article) notFound();

  const webPage = webPageJsonLd(article.path);
  const resourcesPath = localizePath("/ressources", locale);

  return (
    <SiteShell
      currentPath={article.path}
      layout="content"
      breadcrumbs={[
        { name: RESOURCES_LABEL[locale], path: resourcesPath },
        { name: article.title, path: article.path },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: RESOURCES_LABEL[locale], path: resourcesPath },
            { name: article.title, path: article.path },
          ]),
          articleJsonLd(
            {
              path: article.path,
              title: article.title,
              description: article.description,
              publishedAt: article.publishedAt,
              updatedAt: getArticleUpdatedAt(article),
            },
            locale,
          ),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ResourceArticleContent article={article} locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
