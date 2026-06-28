import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { LEAD_MAGNETS } from "@/lib/lead-magnets";
import { getHomeCopy, localizePath, type Locale } from "@/lib/i18n";

type HomeLeadMagnetSectionProps = {
  locale?: Locale;
};

export function HomeLeadMagnetSection({ locale = "fr" }: HomeLeadMagnetSectionProps) {
  const magnet = LEAD_MAGNETS.find((m) => m.slug === "grille-excel-vs-logiciel");
  const copy = getHomeCopy(locale).leadMagnet;
  if (!magnet) return null;

  return (
    <section
      id="outil-gratuit"
      aria-labelledby="home-lead-magnet-heading"
      className="relative w-full bg-[#0c1220]/40 pb-10 pt-4 sm:pb-12 sm:pt-6 lg:pb-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-col gap-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/8 to-transparent p-6 shadow-[0_0_56px_-20px_rgba(56,189,248,0.2)] lg:flex-row lg:items-center lg:gap-10 lg:p-8 xl:gap-12">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-sky-500/25 bg-sky-500/10 text-sky-400 lg:h-16 lg:w-16">
            <ClipboardCheck className="h-7 w-7 lg:h-8 lg:w-8" aria-hidden />
          </span>

          <div className="min-w-0 flex-1">
            <SectionLabel>{copy.sectionLabel}</SectionLabel>
            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h2
                id="home-lead-magnet-heading"
                className="text-xl font-bold text-white sm:text-2xl lg:text-3xl"
              >
                {copy.title}
              </h2>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                {copy.badge}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base lg:max-w-none">
              {copy.subtitle}. {copy.descriptionSuffix}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {copy.format} · {copy.formatNote}
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:flex-col lg:items-end">
            <Button href={localizePath(magnet.path, locale)} variant="primary" size="sm" showArrow className="w-full sm:w-auto lg:min-w-[220px]">
              {copy.cta}
            </Button>
            <Link
              href={localizePath(copy.articleHref, locale)}
              className="text-center text-xs text-slate-500 hover:text-sky-400 sm:text-left lg:text-right"
            >
              {copy.articleLink}
              <ArrowRight className="ml-0.5 inline h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
