import Link from "next/link";
import { FileDown } from "lucide-react";
import { LeadMagnetForm } from "@/components/lead-magnets/LeadMagnetForm";
import { ExcelDiagnosticChecklist } from "@/components/lead-magnets/ExcelDiagnosticChecklist";
import { localizePath, type Locale } from "@/lib/i18n";
import { getLeadMagnetLandingCopy } from "@/lib/lead-magnets";
import type { LeadMagnetDefinition } from "@/lib/lead-magnets/types";

type LeadMagnetLandingProps = {
  magnet: LeadMagnetDefinition;
  locale?: Locale;
};

function LeadMagnetFooter({
  magnet,
  locale = "fr",
}: {
  magnet: LeadMagnetDefinition;
  locale?: Locale;
}) {
  const contactLabel = locale === "en" ? "Get in touch" : "Prendre contact";
  const allGuidesLabel = locale === "en" ? "← All guides" : "← Tous les guides";

  return (
    <footer className="mt-12 pt-8">
      {magnet.ctaAfterDownload && (
        <p className="text-sm text-slate-500">
          {magnet.ctaAfterDownload}{" "}
          <Link
            href={localizePath("/contact", locale)}
            className="text-sky-400 hover:text-sky-300"
          >
            {contactLabel}
          </Link>
          .
        </p>
      )}
      <p className={`text-sm text-slate-500 ${magnet.ctaAfterDownload ? "mt-4" : ""}`}>
        <Link
          href={localizePath("/ressources", locale)}
          className="text-sky-400 hover:text-sky-300"
        >
          {allGuidesLabel}
        </Link>
        {magnet.relatedArticlePath && (
          <>
            {" · "}
            <Link
              href={localizePath(magnet.relatedArticlePath, locale)}
              className="text-sky-400 hover:text-sky-300"
            >
              {magnet.relatedArticleLabel}
            </Link>
          </>
        )}
      </p>
    </footer>
  );
}

function ExcelGrilleLanding({
  magnet,
  locale = "fr",
}: {
  magnet: LeadMagnetDefinition;
  locale?: Locale;
}) {
  const copy = getLeadMagnetLandingCopy(locale);
  const formAriaLabel =
    locale === "en" ? "Download form" : "Formulaire de téléchargement";

  return (
    <>
      <section
        aria-labelledby="excel-step-1-heading"
        className="mt-10 rounded-2xl border border-white/10 bg-[#0c1220]/60 p-6 sm:p-8"
      >
        <h2 id="excel-step-1-heading" className="text-xl font-bold text-white">
          {copy.step1Title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{copy.step1Intro}</p>
        <div className="mt-6">
          <ExcelDiagnosticChecklist locale={locale} />
        </div>
      </section>

      <section
        id="telecharger"
        className="mt-8 scroll-mt-28 sm:mt-10"
        aria-label={formAriaLabel}
      >
        <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-5 sm:p-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">{copy.step2Title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{copy.step2Intro}</p>
          <LeadMagnetForm
            magnetSlug={magnet.slug}
            downloadPath={magnet.downloadPath}
            downloadFileName={magnet.downloadFileName}
            submitLabel={copy.submitPdf}
            locale={locale}
            className="mt-6"
          />
        </div>
      </section>

      <LeadMagnetFooter magnet={magnet} locale={locale} />
    </>
  );
}

export function LeadMagnetLanding({ magnet, locale = "fr" }: LeadMagnetLandingProps) {
  const isExcelGrille = magnet.slug === "grille-excel-vs-logiciel";
  const copy = getLeadMagnetLandingCopy(locale);
  const formAriaLabel =
    locale === "en" ? "Download form" : "Formulaire de téléchargement";

  return (
    <article className="relative py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header>
          <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-400 sm:tracking-[0.15em]">
            <FileDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{copy.badge}</span>
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {magnet.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-400">{magnet.description}</p>
        </header>

        {isExcelGrille ? (
          <ExcelGrilleLanding magnet={magnet} locale={locale} />
        ) : (
          <>
            {magnet.highlights.length > 0 && (
              <ul className="mt-8 space-y-2">
                {magnet.highlights.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-slate-300">
                    · {item}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-10 flex flex-col gap-10 lg:grid lg:grid-cols-5 lg:gap-10">
              <section
                id="telecharger"
                className="order-1 scroll-mt-28 lg:order-2 lg:col-span-2"
                aria-label={formAriaLabel}
              >
                <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-5 sm:p-6 lg:sticky lg:top-28">
                  <h2 className="text-lg font-semibold text-white">{copy.receivePdf}</h2>
                  <p className="mt-2 text-sm text-slate-400">{copy.receivePdfHint}</p>
                  <LeadMagnetForm
                    magnetSlug={magnet.slug}
                    downloadPath={magnet.downloadPath}
                    downloadFileName={magnet.downloadFileName}
                    submitLabel={copy.receivePdf}
                    locale={locale}
                    className="mt-6"
                  />
                </div>
              </section>

              <section className="order-2 min-w-0 lg:order-1 lg:col-span-3">
                <h2 className="text-lg font-semibold text-white">{copy.contentHeading}</h2>
                <div className="mt-4 space-y-6">
                  {magnet.previewSections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-semibold text-sky-400">{section.title}</h3>
                      <ul className="mt-2 space-y-1.5">
                        {section.items.map((item) => (
                          <li key={item} className="text-sm leading-relaxed text-slate-400">
                            · {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <LeadMagnetFooter magnet={magnet} locale={locale} />
          </>
        )}
      </div>
    </article>
  );
}
