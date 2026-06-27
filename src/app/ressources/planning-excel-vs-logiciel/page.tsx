import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ResourceArticleContent } from "@/components/ResourceArticleContent";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import {
  CompetitorComparisonTable,
  PlanningComparisonTable,
} from "@/components/geo/PlanningComparisonTable";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  createPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { getResourceArticle } from "@/lib/resources";

const SLUG = "planning-excel-vs-logiciel";

export function generateMetadata() {
  const article = getResourceArticle(SLUG);
  if (!article) return {};

  return createPageMetadata({
    path: article.path,
    keywords: article.keywords,
  });
}

export default function PlanningExcelArticlePage() {
  const article = getResourceArticle(SLUG);
  if (!article) notFound();

  const webPage = webPageJsonLd(article.path);

  return (
    <SiteShell
      currentPath={article.path}
      layout="content"
      breadcrumbs={[
        { name: "Ressources", path: "/ressources" },
        { name: "Excel vs logiciel", path: article.path },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Ressources", path: "/ressources" },
            { name: "Excel vs logiciel", path: article.path },
          ]),
          articleJsonLd({
            path: article.path,
            title: article.title,
            description: article.description,
            publishedAt: article.publishedAt,
          }),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <section className="py-14 sm:py-16">
          <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="product" />
            <CompetitorComparisonTable id="comparatif-excel-planory-holydis" />
            <PlanningComparisonTable id="comparatif-excel-sirh-planory" />
          </div>
        </section>
        <ResourceArticleContent article={article} />
        <ContactSection />
      </PageContent>
    </SiteShell>
  );
}
