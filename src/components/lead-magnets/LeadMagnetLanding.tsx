import Link from "next/link";
import { FileDown } from "lucide-react";
import { LeadMagnetForm } from "@/components/lead-magnets/LeadMagnetForm";
import { ExcelDiagnosticChecklist } from "@/components/lead-magnets/ExcelDiagnosticChecklist";
import type { LeadMagnetDefinition } from "@/lib/lead-magnets/types";

type LeadMagnetLandingProps = {
  magnet: LeadMagnetDefinition;
};

function LeadMagnetFooter({ magnet }: { magnet: LeadMagnetDefinition }) {
  return (
    <footer className="mt-12 pt-8">
      {magnet.ctaAfterDownload && (
        <p className="text-sm text-slate-500">
          {magnet.ctaAfterDownload}{" "}
          <Link href="/contact" className="text-sky-400 hover:text-sky-300">
            Prendre contact
          </Link>
          .
        </p>
      )}
      <p className={`text-sm text-slate-500 ${magnet.ctaAfterDownload ? "mt-4" : ""}`}>
        <Link href="/ressources" className="text-sky-400 hover:text-sky-300">
          ← Tous les guides
        </Link>
        {magnet.relatedArticlePath && (
          <>
            {" · "}
            <Link href={magnet.relatedArticlePath} className="text-sky-400 hover:text-sky-300">
              {magnet.relatedArticleLabel}
            </Link>
          </>
        )}
      </p>
    </footer>
  );
}

function ExcelGrilleLanding({ magnet }: { magnet: LeadMagnetDefinition }) {
  return (
    <>
      <section
        aria-labelledby="excel-step-1-heading"
        className="mt-10 rounded-2xl border border-white/10 bg-[#0c1220]/60 p-6 sm:p-8"
      >
        <h2 id="excel-step-1-heading" className="text-xl font-bold text-white">
          1. Votre score (gratuit, sans email)
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Cochez ce qui correspond à votre situation. Le score s&apos;affiche en direct.
        </p>
        <div className="mt-6">
          <ExcelDiagnosticChecklist />
        </div>
      </section>

      <section
        id="telecharger"
        className="mt-8 scroll-mt-28 sm:mt-10"
        aria-label="Formulaire de téléchargement"
      >
        <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-5 sm:p-8">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            2. Recevoir la grille PDF
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Même contenu, version imprimable envoyée par email — pour une réunion ou un dossier
            interne.
          </p>
          <LeadMagnetForm
            magnetSlug={magnet.slug}
            downloadPath={magnet.downloadPath}
            downloadFileName={magnet.downloadFileName}
            submitLabel="Recevoir la grille PDF"
            className="mt-6"
          />
        </div>
      </section>

      <LeadMagnetFooter magnet={magnet} />
    </>
  );
}

export function LeadMagnetLanding({ magnet }: LeadMagnetLandingProps) {
  const isExcelGrille = magnet.slug === "grille-excel-vs-logiciel";

  return (
    <article className="relative py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <header>
          <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-400 sm:tracking-[0.15em]">
            <FileDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>Ressource gratuite</span>
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
            {magnet.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-400">{magnet.description}</p>
        </header>

        {isExcelGrille ? (
          <ExcelGrilleLanding magnet={magnet} />
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
                aria-label="Formulaire de téléchargement"
              >
                <div className="rounded-2xl border border-white/10 bg-[#0c1220]/80 p-5 sm:p-6 lg:sticky lg:top-28">
                  <h2 className="text-lg font-semibold text-white">Recevoir le PDF</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Envoyé par email. Pas de téléphone requis.
                  </p>
                  <LeadMagnetForm
                    magnetSlug={magnet.slug}
                    downloadPath={magnet.downloadPath}
                    downloadFileName={magnet.downloadFileName}
                    submitLabel="Recevoir le PDF"
                    className="mt-6"
                  />
                </div>
              </section>

              <section className="order-2 min-w-0 lg:order-1 lg:col-span-3">
                <h2 className="text-lg font-semibold text-white">Contenu</h2>
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

            <LeadMagnetFooter magnet={magnet} />
          </>
        )}
      </div>
    </article>
  );
}
