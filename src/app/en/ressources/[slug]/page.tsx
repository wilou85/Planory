import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ResourceArticleContent } from "@/components/ResourceArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import {
  getResourceArticle,
  getResourceArticles,
  getArticleUpdatedAt,
} from "@/lib/resources";
import { SITE_URL } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getResourceArticles("en").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getResourceArticle(slug, "en");
  if (!article) return {};

  const frArticle = getResourceArticle(slug, "fr");

  return {
    ...createPageMetadata({
      path: article.path,
      title: `${article.title} | Planory`,
      description: article.description,
      keywords: article.keywords,
    }),
    alternates: {
      canonical: `${SITE_URL}${article.path}`,
      languages: {
        "fr-FR": frArticle ? `${SITE_URL}${frArticle.path}` : `${SITE_URL}/ressources`,
        "en-GB": `${SITE_URL}${article.path}`,
      },
    },
    openGraph: {
      locale: "en_GB",
      alternateLocale: ["fr_FR"],
    },
  };
}

export default async function EnglishResourceArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getResourceArticle(slug, "en");
  if (!article) notFound();

  const webPage = webPageJsonLd(article.path);

  return (
    <SiteShell
      currentPath={article.path}
      layout="content"
      breadcrumbs={[
        { name: "Resources", path: "/en/ressources" },
        { name: article.title, path: article.path },
      ]}
    >
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Resources", path: "/en/ressources" },
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
            "en",
          ),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ResourceArticleContent article={article} locale="en" />
      </PageContent>
    </SiteShell>
  );
}
