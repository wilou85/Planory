import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { OfferSection } from "@/components/OfferSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({ path: "/offre" });

export default function OffrePage() {
  const webPage = webPageJsonLd("/offre");

  return (
    <SiteShell currentPath="/offre">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Offre", path: "/offre" },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <OfferSection />
      </PageContent>
    </SiteShell>
  );
}
