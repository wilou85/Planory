import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { DiscoverPlanory } from "@/components/seo/DiscoverPlanory";
import { Hero } from "@/components/Hero";
import { ValuePropositionSection } from "@/components/ValuePropositionSection";
import { HomeLeadMagnetSection } from "@/components/HomeLeadMagnetSection";
import { EnGeoSection } from "@/components/geo/EnGeoSection";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { EN_SITE } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata = {
  ...createPageMetadata({
    path: "/en",
    title: EN_SITE.title,
    description: EN_SITE.description,
    keywords: [
      "healthcare workforce scheduling software",
      "workforce scheduling software",
      "shift planning software",
      "hospital workforce scheduling",
      "AI scheduling",
      "24/7 team scheduling",
    ],
  }),
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      "fr-FR": SITE_URL,
      "en-GB": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
  },
};

export default function EnglishHomePage() {
  const webPage = webPageJsonLd("/en");

  return (
    <SiteShell currentPath="/en">
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/en" }]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <Hero locale="en" />
      <HomeLeadMagnetSection locale="en" />
      <ValuePropositionSection locale="en" />
      <EnGeoSection />
      <DiscoverPlanory locale="en" />
    </SiteShell>
  );
}
