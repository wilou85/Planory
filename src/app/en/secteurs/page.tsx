import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { SectorsSection } from "@/components/SectorsSection";
import { GeoDefinition } from "@/components/geo/GeoDefinition";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/secteurs";
const FR_PATH = "/secteurs";

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Hospital, airport, industry & retail scheduling | Planory",
    description:
      "Hospital scheduling, on-call duties, 3×8 industrial rotations, retail staffing and 24/7 airport planning. Concrete use cases by sector with Planory.",
    keywords: [
      "hospital scheduling",
      "healthcare workforce scheduling",
      "airport scheduling",
      "industrial shift planning",
      "24/7 team scheduling",
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

export default function EnglishSectorsPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell currentPath={PATH}>
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Sectors", path: PATH },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <section className="py-14 sm:pb-0">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <GeoDefinition variant="sectors" locale="en" showSupport={false} />
          </div>
        </section>
        <SectorsSection locale="en" />
      </PageContent>
    </SiteShell>
  );
}
