import { SiteShell } from "@/components/SiteShell";
import { PageContent } from "@/components/PageContent";
import { ContactSection } from "@/components/ContactSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

const PATH = "/contact";

export const metadata = createPageMetadata({
  path: PATH,
  title: "Contact Planory — Demande de démo et échange",
  description:
    "Contactez Planory pour un échange de 20 minutes sur votre contexte de planification d'équipes 24/7. Formulaire de contact — réponse rapide.",
  keywords: ["contact Planory", "démo planning", "logiciel planning équipe"],
});

export default function ContactPage() {
  const webPage = webPageJsonLd(PATH);

  return (
    <SiteShell currentPath={PATH} layout="content">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Contact", path: PATH },
          ]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <PageContent>
        <ContactSection standalone />
      </PageContent>
    </SiteShell>
  );
}
