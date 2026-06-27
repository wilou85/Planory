import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { DiscoverPlanory } from "@/components/seo/DiscoverPlanory";
import { Hero } from "@/components/Hero";
import { createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  ...createPageMetadata({ path: "/" }),
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr-FR": SITE_URL,
      "en-GB": `${SITE_URL}/en`,
    },
  },
};

export default function Home() {
  const webPage = webPageJsonLd("/");

  return (
    <SiteShell currentPath="/">
      {webPage && <JsonLd data={webPage} />}
      <Hero />
      <DiscoverPlanory />
    </SiteShell>
  );
}
