import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ProductSection } from "@/components/ProductSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/produit";
const FR_PATH = "/produit";

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Team scheduling software, HR planning & social scheduling | Planory",
    description:
      "Workforce scheduling software for 24/7 teams: HR planning, shift scheduling, personal schedule management and SKYNET optimisation.",
    keywords: [
      "workforce scheduling software",
      "team scheduling software",
      "HR planning",
      "shift planning software",
      "scheduling software",
      "workforce scheduling",
      "AI scheduling",
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

export default function EnglishProductPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell currentPath={PATH}>
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Product", path: PATH },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ProductSection locale="en" />
      </PageContent>
    </SiteShell>
  );
}
