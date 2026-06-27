import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { HospitalSectorContent } from "@/components/HospitalSectorContent";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  customFaqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { HOSPITAL_SECTOR } from "@/lib/resources";
import { SITE_URL } from "@/lib/site";

const PATH = "/secteurs/hopital";

export const metadata = createPageMetadata({
  path: PATH,
  keywords: [
    "planning hospitalier",
    "gestion astreintes",
    "planning roulement hospitalier",
    "logiciel planning hospitalier",
  ],
});

export default function HopitalPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell
      currentPath={PATH}
      layout="content"
      breadcrumbs={[
        { name: "Secteurs", path: "/secteurs" },
        { name: "Planning hospitalier", path: PATH },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Secteurs", path: "/secteurs" },
            { name: "Planning hospitalier", path: PATH },
          ]),
          customFaqJsonLd(HOSPITAL_SECTOR.faq, `${SITE_URL}${PATH}#faq`),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <HospitalSectorContent />
        <ContactSection />
      </PageContent>
    </SiteShell>
  );
}
