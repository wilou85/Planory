import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { HospitalSectorContent } from "@/components/HospitalSectorContent";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  customFaqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { HOSPITAL_SECTOR } from "@/lib/hospital-sector";
import { SITE_URL } from "@/lib/site";

const PATH = "/secteurs/hopital";

export const metadata = createPageMetadata({
  path: PATH,
  title: "Planning hospitalier, planning médical & planning hôpital | Planory",
  description:
    "Logiciel de planning hospitalier et planning médical avec IA : gardes, planning de garde, planning roulement hospitalier, astreintes 12h et réglementation FPH.",
  keywords: [
    "planning hospitalier",
    "planning hopital",
    "planning médical",
    "planning de garde",
    "planning roulement hospitalier",
    "logiciel planning hospitalier",
    "réglementation planning fonction publique hospitalière",
    "planning en 12 heures en milieu hospitalier",
  ],
});

export default function HopitalPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell
      currentPath={PATH}
      layout="content"
      breadcrumbs={[
        { name: "Accueil", path: "/" },
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
      </PageContent>
    </SiteShell>
  );
}
