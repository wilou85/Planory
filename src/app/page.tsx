/**
 * Public French home at `/`.
 * Served here (not via `/` → `/fr` rewrite) to avoid fighting the SEO redirect `/fr` → `/`.
 */
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { DiscoverPlanory } from "@/components/seo/DiscoverPlanory";
import { BrandPresenceSection } from "@/components/geo/BrandPresenceSection";
import { Hero } from "@/components/Hero";
import { ValuePropositionSection } from "@/components/ValuePropositionSection";
import { HomeLeadMagnetSection } from "@/components/HomeLeadMagnetSection";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata() {
  return {
    ...createPageMetadata({
      path: "/",
      keywords: undefined,
    }),
    alternates: {
      canonical: SITE_URL,
      languages: {
        "fr-FR": SITE_URL,
        "en-GB": `${SITE_URL}/en`,
        "x-default": SITE_URL,
      },
    },
  };
}

export default function RootPage() {
  const path = "/";
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell currentPath={path}>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Accueil", path }]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <Hero locale="fr" />
      <HomeLeadMagnetSection locale="fr" />
      <ValuePropositionSection locale="fr" />
      <DiscoverPlanory locale="fr" />
      <BrandPresenceSection locale="fr" />
    </SiteShell>
  );
}
