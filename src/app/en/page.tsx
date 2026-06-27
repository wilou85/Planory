import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/Hero";
import { CONTACT_EMAIL } from "@/lib/content";
import { EN_SITE } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { breadcrumbJsonLd, createPageMetadata, webPageJsonLd } from "@/lib/seo";

export const metadata = {
  ...createPageMetadata({
    path: "/en",
    title: EN_SITE.title,
    description: EN_SITE.description,
    keywords: [
      "workforce scheduling software",
      "shift planning software",
      "healthcare scheduling",
      "AI scheduling",
    ],
  }),
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      "fr-FR": SITE_URL,
      "en-GB": `${SITE_URL}/en`,
    },
  },
  openGraph: {
    locale: "en_GB",
    alternateLocale: ["fr_FR"],
  },
};

export default function EnglishHomePage() {
  const webPage = webPageJsonLd("/en");

  return (
    <SiteShell currentPath="/en">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/en" }]),
          ...(webPage ? [webPage] : []),
        ]}
      />
      <Hero locale="en" />
      <section className="border-t border-white/10 py-8 sm:py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm leading-relaxed text-slate-500">
            Full English site coming soon —{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300">
              contact us
            </a>{" "}
            for a demo.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
