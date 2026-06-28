import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ToolsHub } from "@/components/lead-magnets/LeadMagnetsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd, toolsItemListJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const PATH = "/en/ressources/outils";
const FR_PATH = TOOLS_HUB_PATH;

export const metadata = {
  ...createPageMetadata({
    path: PATH,
    title: "Free tools — grids and scheduling templates | Planory",
    description:
      "Free Planory tools: Excel vs software self-assessment grids, templates and checklists to scope a 24/7 team scheduling project.",
    keywords: [
      "free scheduling tool",
      "excel scheduling grid",
      "scheduling self-assessment",
      "team planning resources",
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

function toolsItemListJsonLdEn() {
  return toolsItemListJsonLd("en");
}

export default function EnglishToolsPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell
      currentPath={PATH}
      layout="content"
      breadcrumbs={[
        { name: "Resources", path: "/en/ressources" },
        { name: "Tools", path: PATH },
      ]}
    >
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Resources", path: "/en/ressources" },
            { name: "Tools", path: PATH },
          ]),
          toolsItemListJsonLdEn(),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ToolsHub locale="en" />
      </PageContent>
    </SiteShell>
  );
}
