import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ResourcesHub } from "@/components/ResourcesHub";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const PATH = "/ressources";

export const metadata = createPageMetadata({
  path: PATH,
  keywords: ["guide planning équipe", "planification RH", "planning excel"],
});

export default function RessourcesPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell currentPath={PATH} layout="content">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Ressources", path: PATH },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ResourcesHub />
        <ContactSection />
      </PageContent>
    </SiteShell>
  );
}
