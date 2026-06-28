import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { LeadMagnetLanding } from "@/components/lead-magnets/LeadMagnetLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { getLeadMagnet, LEAD_MAGNETS } from "@/lib/lead-magnets";
import { localizePath } from "@/lib/i18n";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const EN_TOOLS_HUB_PATH = "/en/ressources/outils";

type LeadMagnetPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return LEAD_MAGNETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: LeadMagnetPageProps) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug, "en");
  if (!magnet) return {};

  const enPath = localizePath(magnet.path, "en");

  return {
    ...createPageMetadata({
      path: enPath,
      title: magnet.title,
      description: magnet.description,
      keywords: magnet.keywords,
    }),
    alternates: {
      canonical: `${SITE_URL}${enPath}`,
      languages: {
        "fr-FR": `${SITE_URL}${magnet.path}`,
        "en-GB": `${SITE_URL}${enPath}`,
      },
    },
    openGraph: {
      locale: "en_GB",
      alternateLocale: ["fr_FR"],
    },
  };
}

export default async function EnglishLeadMagnetPage({ params }: LeadMagnetPageProps) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug, "en");
  if (!magnet) notFound();

  const enPath = localizePath(magnet.path, "en");
  const webPage = webPageJsonLd(enPath);

  return (
    <SiteShell
      currentPath={enPath}
      layout="content"
      suppressStickyContact
      breadcrumbs={[
        { name: "Resources", path: "/en/ressources" },
        { name: "Tools", path: EN_TOOLS_HUB_PATH },
        { name: magnet.title, path: enPath },
      ]}
    >
      <SetHtmlLang lang="en" />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/en" },
            { name: "Resources", path: "/en/ressources" },
            { name: "Tools", path: EN_TOOLS_HUB_PATH },
            { name: magnet.title, path: enPath },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <LeadMagnetLanding magnet={magnet} locale="en" />
      </PageContent>
    </SiteShell>
  );
}
