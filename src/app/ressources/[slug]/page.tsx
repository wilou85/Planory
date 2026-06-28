import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ResourceArticleContent } from "@/components/ResourceArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { getResourceArticle, getArticleUpdatedAt, RESOURCE_ARTICLES } from "@/lib/resources";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return RESOURCE_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) return {};

  return createPageMetadata({
    path: article.path,
    title: `${article.title} | Planory`,
    description: article.description,
    keywords: article.keywords,
  });
}

export default async function ResourceArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) notFound();

  const webPage = webPageJsonLd(article.path);

  return (
    <SiteShell
      currentPath={article.path}
      layout="content"
      breadcrumbs={[
        { name: "Articles", path: "/ressources" },
        { name: article.title, path: article.path },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Articles", path: "/ressources" },
            { name: article.title, path: article.path },
          ]),
          articleJsonLd({
            path: article.path,
            title: article.title,
            description: article.description,
            publishedAt: article.publishedAt,
            updatedAt: getArticleUpdatedAt(article),
          }),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ResourceArticleContent article={article} />
      </PageContent>
    </SiteShell>
  );
}
