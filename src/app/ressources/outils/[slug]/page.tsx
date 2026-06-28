import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { LeadMagnetLanding } from "@/components/lead-magnets/LeadMagnetLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLeadMagnet, LEAD_MAGNETS, TOOLS_HUB_PATH } from "@/lib/lead-magnets";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

type LeadMagnetPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return LEAD_MAGNETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: LeadMagnetPageProps) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) return {};

  return createPageMetadata({
    path: magnet.path,
    title: magnet.title,
    description: magnet.description,
    keywords: magnet.keywords,
  });
}

export default async function LeadMagnetPage({ params }: LeadMagnetPageProps) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();

  const webPage = webPageJsonLd(magnet.path);

  return (
    <SiteShell
      currentPath={magnet.path}
      layout="content"
      suppressStickyContact
      breadcrumbs={[
        { name: "Articles", path: "/ressources" },
        { name: "Outils", path: TOOLS_HUB_PATH },
        { name: magnet.title, path: magnet.path },
      ]}
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Articles", path: "/ressources" },
            { name: "Outils", path: TOOLS_HUB_PATH },
            { name: magnet.title, path: magnet.path },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <LeadMagnetLanding magnet={magnet} />
      </PageContent>
    </SiteShell>
  );
}
