import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ToolsHub } from "@/components/lead-magnets/LeadMagnetsSection";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { breadcrumbJsonLd, createPageMetadata, toolsItemListJsonLd, webPageJsonLd } from "@/lib/seo";

const TITLE: Record<Locale, string> = {
  fr: "Outils gratuits — grilles et modèles planification | Planory",
  en: "Free tools — grids and scheduling templates | Planory",
};

const DESCRIPTION: Record<Locale, string> = {
  fr:
    "Outils gratuits Planory : grilles d'auto-diagnostic Excel vs logiciel, modèles et checklists pour cadrer un projet de planification d'équipes 24/7.",
  en:
    "Free Planory tools: Excel vs software self-assessment grids, templates and checklists to scope a 24/7 team scheduling project.",
};

const KEYWORDS: Record<Locale, string[]> = {
  fr: [
    "outil planning gratuit",
    "grille excel planning",
    "auto-diagnostic planning",
    "ressources planification équipes",
  ],
  en: [
    "free scheduling tool",
    "excel scheduling grid",
    "scheduling self-assessment",
    "team planning resources",
  ],
};

const RESOURCES_LABEL: Record<Locale, string> = { fr: "Articles", en: "Blogs" };
const TOOLS_LABEL: Record<Locale, string> = { fr: "Outils", en: "Tools" };

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const locale = parseLocaleParam((await params).locale);
  const path = localizePath(TOOLS_HUB_PATH, locale);

  return createPageMetadata({
    path,
    title: TITLE[locale],
    description: DESCRIPTION[locale],
    keywords: KEYWORDS[locale],
  });
}

export default async function OutilsPage({ params }: Props) {
  const locale: Locale = parseLocaleParam((await params).locale);
  const path = localizePath(TOOLS_HUB_PATH, locale);
  const resourcesPath = localizePath("/ressources", locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell
      currentPath={path}
      layout="content"
      breadcrumbs={[
        { name: RESOURCES_LABEL[locale], path: resourcesPath },
        { name: TOOLS_LABEL[locale], path },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: RESOURCES_LABEL[locale], path: resourcesPath },
            { name: TOOLS_LABEL[locale], path },
          ]),
          toolsItemListJsonLd(locale),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ToolsHub locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
