import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ProductSection } from "@/components/ProductSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata = createPageMetadata({
  path: "/produit",
  keywords: [
    "logiciel planning équipe",
    "planification RH",
    "logiciel planification RH",
    "planning IA",
  ],
});

export default function ProduitPage() {
  const webPage = webPageJsonLd("/produit");

  return (
    <SiteShell currentPath="/produit">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Produit", path: "/produit" },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ProductSection />
      </PageContent>
    </SiteShell>
  );
}
