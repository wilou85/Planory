import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ToolsHub } from "@/components/lead-magnets/LeadMagnetsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { LEAD_MAGNETS, TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = createPageMetadata({
  path: TOOLS_HUB_PATH,
  title: "Outils gratuits — grilles et modèles planification | Planory",
  description:
    "Outils gratuits Planory : grilles d'auto-diagnostic Excel vs logiciel, modèles et checklists pour cadrer un projet de planification d'équipes 24/7.",
  keywords: [
    "outil planning gratuit",
    "grille excel planning",
    "auto-diagnostic planning",
    "ressources planification équipes",
  ],
});

function toolsItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Outils gratuits Planory",
    url: `${SITE_URL}${TOOLS_HUB_PATH}`,
    numberOfItems: LEAD_MAGNETS.length,
    itemListElement: LEAD_MAGNETS.map((magnet, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: magnet.title,
      url: `${SITE_URL}${magnet.path}`,
    })),
  };
}

export default function OutilsPage() {
  const webPage = webPageJsonLd(TOOLS_HUB_PATH);

  return (
    <SiteShell
      currentPath={TOOLS_HUB_PATH}
      layout="content"
      breadcrumbs={[
        { name: "Articles", path: "/ressources" },
        { name: "Outils", path: TOOLS_HUB_PATH },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Articles", path: "/ressources" },
            { name: "Outils", path: TOOLS_HUB_PATH },
          ]),
          toolsItemListJsonLd(),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ToolsHub />
      </PageContent>
    </SiteShell>
  );
}
