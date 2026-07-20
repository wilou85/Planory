import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { LeadMagnetLanding } from "@/components/lead-magnets/LeadMagnetLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Locale } from "@/lib/i18n";
import { homePath, localizePath } from "@/lib/i18n";
import { generateLocaleStaticParams, parseLocaleParam } from "@/lib/locale-params";
import { getLeadMagnet, LEAD_MAGNETS, TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const RESOURCES_LABEL: Record<Locale, string> = { fr: "Articles", en: "Blogs" };
const TOOLS_LABEL: Record<Locale, string> = { fr: "Outils", en: "Tools" };

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return generateLocaleStaticParams().flatMap(({ locale }) =>
    LEAD_MAGNETS.map((magnet) => ({ locale, slug: magnet.slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = parseLocaleParam(rawLocale);
  const magnet = getLeadMagnet(slug, locale);
  if (!magnet) return {};

  const path = localizePath(magnet.path, locale);
  const meta = createPageMetadata({
    path,
    title: magnet.title,
    description: magnet.description,
    keywords: magnet.keywords,
  });

  if (locale === "fr") return meta;

  return {
    ...meta,
    alternates: {
      canonical: `${SITE_URL}${path}`,
      languages: {
        "fr-FR": `${SITE_URL}${magnet.path}`,
        "en-GB": `${SITE_URL}${path}`,
        "x-default": `${SITE_URL}${magnet.path}`,
      },
    },
  };
}

export default async function LeadMagnetPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = parseLocaleParam(rawLocale);
  const magnet = getLeadMagnet(slug, locale);
  if (!magnet) notFound();

  const path = localizePath(magnet.path, locale);
  const resourcesPath = localizePath("/ressources", locale);
  const toolsPath = localizePath(TOOLS_HUB_PATH, locale);
  const webPage = webPageJsonLd(path);

  return (
    <SiteShell
      currentPath={path}
      layout="content"
      suppressStickyContact
      breadcrumbs={[
        { name: RESOURCES_LABEL[locale], path: resourcesPath },
        { name: TOOLS_LABEL[locale], path: toolsPath },
        { name: magnet.title, path },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: locale === "en" ? "Home" : "Accueil", path: homePath(locale) },
            { name: RESOURCES_LABEL[locale], path: resourcesPath },
            { name: TOOLS_LABEL[locale], path: toolsPath },
            { name: magnet.title, path },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <LeadMagnetLanding magnet={magnet} locale={locale} />
      </PageContent>
    </SiteShell>
  );
}
