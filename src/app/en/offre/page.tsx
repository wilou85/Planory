import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { OfferSection } from "@/components/OfferSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/offre";
const FR_PATH = "/offre";

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Planory pricing: Self-serve, Supported, Mission-critical",
    description:
      "Three engagement levels to deploy Planory: self-serve, supported with a dedicated contact, or mission-critical for regulated 24/7 environments.",
    keywords: [
      "workforce scheduling pricing",
      "scheduling software pricing",
      "Planory pricing",
      "healthcare scheduling software",
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

export default function EnglishOfferPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell currentPath={PATH}>
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Pricing", path: PATH },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <OfferSection locale="en" />
      </PageContent>
    </SiteShell>
  );
}
