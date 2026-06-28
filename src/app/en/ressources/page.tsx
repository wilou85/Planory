import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { ResourcesHub } from "@/components/ResourcesHub";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { getResourceArticles } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/ressources";
const FR_PATH = "/ressources";

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Scheduling guides & team planning | Planory",
    description:
      "Practical guides on team scheduling, on-call duties and 24/7 shift patterns.",
    keywords: [
      "team scheduling guide",
      "HR planning guide",
      "workforce scheduling",
      "on-call planning",
    ],
  }),
  alternates: {
    canonical: `${SITE_URL}${PATH}`,
    languages: {
      "fr-FR": `${SITE_URL}${FR_PATH}`,
      "en-GB": `${SITE_URL}${PATH}`,
    },
  },
  openGraph: {
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
  },
};

function resourceArticlesItemListJsonLdEn() {
  const articles = getResourceArticles("en");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${PATH}#article-list`,
    name: "Scheduling guides & team planning — Planory",
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      description: article.description,
      url: `${SITE_URL}${article.path}`,
    })),
  };
}

export default function EnglishResourcesPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell
      currentPath={PATH}
      layout="content"
      breadcrumbs={[{ name: "Resources", path: PATH }]}
    >
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Resources", path: PATH },
          ]),
          resourceArticlesItemListJsonLdEn(),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ResourcesHub locale="en" />
        <section className="pb-14 pt-10 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="faq" locale="en" />
          </div>
        </section>
      </PageContent>
    </SiteShell>
  );
}
