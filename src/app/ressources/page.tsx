import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { ResourcesHub } from "@/components/ResourcesHub";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata, resourceArticlesItemListJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/ressources";

export const metadata = createPageMetadata({
  path: PATH,
  keywords: ["guide planning équipe", "planification RH", "planning excel"],
});

export default function RessourcesPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell
      currentPath={PATH}
      layout="content"
      breadcrumbs={[{ name: "Articles", path: PATH }]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Articles", path: PATH },
          ]),
          resourceArticlesItemListJsonLd(),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ResourcesHub />
        <section className="pb-14 pt-10 sm:pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="faq" />
          </div>
        </section>
      </PageContent>
    </SiteShell>
  );
}
