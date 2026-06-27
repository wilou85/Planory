import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { SectorsSection } from "@/components/SectorsSection";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
export const metadata = createPageMetadata({ path: "/secteurs" });

export default function SecteursPage() {
  const webPage = webPageJsonLd("/secteurs");

  return (
    <SiteShell currentPath="/secteurs">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Secteurs", path: "/secteurs" },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <section className="py-14 sm:pb-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="sectors" />
          </div>
        </section>
        <SectorsSection />
        <ContactSection />
      </PageContent>
    </SiteShell>
  );
}
