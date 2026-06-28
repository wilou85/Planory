import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { HospitalSectorContent } from "@/components/HospitalSectorContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  customFaqJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { getHospitalSector } from "@/lib/get-content";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/secteurs/hopital";
const FR_PATH = "/secteurs/hopital";

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Hospital scheduling, medical rostering & on-call planning | Planory",
    description:
      "Hospital and medical scheduling software with AI: on-call duties, hospital rotation planning, 12-hour shifts and public healthcare compliance.",
    keywords: [
      "hospital scheduling",
      "medical scheduling",
      "on-call planning",
      "hospital rotation planning",
      "healthcare workforce scheduling",
      "12-hour hospital shifts",
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

export default function EnglishHospitalPage() {
  const webPage = webPageJsonLd(PATH);
  const hospitalFaq = getHospitalSector("en").faq;

  return (
    <SiteShell
      currentPath={PATH}
      layout="content"
      breadcrumbs={[
        { name: "Home", path: "/en" },
        { name: "Sectors", path: "/en/secteurs" },
        { name: "Hospital scheduling", path: PATH },
      ]}
    >
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Sectors", path: "/en/secteurs" },
            { name: "Hospital scheduling", path: PATH },
          ]),
          customFaqJsonLd(hospitalFaq, `${SITE_URL}${PATH}#faq`),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <HospitalSectorContent locale="en" />
      </PageContent>
    </SiteShell>
  );
}
