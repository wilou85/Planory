import Link from "next/link";
import { ArrowRight, FileDown } from "lucide-react";
import { sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LEAD_MAGNETS, TOOLS_HUB_PATH, getLeadMagnet } from "@/lib/lead-magnets";
import { localizePath, type Locale } from "@/lib/i18n";

const TOOLS_COPY = {
  fr: {
    sectionLabel: "Outils gratuits",
    heading: "Ressources à télécharger",
    intro:
      "Grilles, modèles et checklists pour cadrer votre projet de planification — PDF gratuit, sans téléphone obligatoire.",
    contextPrefix: "Besoin de contexte avant de tester ? Consultez nos",
    contextLink: "guides planification",
    teaserIntro:
      "Grilles et modèles pour cadrer votre projet — PDF gratuit, sans téléphone obligatoire.",
    seeAll: "Voir tous les outils",
  },
  en: {
    sectionLabel: "Free tools",
    heading: "Downloadable resources",
    intro:
      "Grids, templates and checklists to scope your scheduling project — free PDF, no phone number required.",
    contextPrefix: "Need context before testing? Read our",
    contextLink: "scheduling guides",
    teaserIntro:
      "Grids and templates to scope your project — free PDF, no phone number required.",
    seeAll: "See all tools",
  },
} as const;

type ToolsLocaleProps = {
  locale?: Locale;
};

function getToolsCopy(locale: Locale) {
  return TOOLS_COPY[locale];
}

function getToolsHubPath(locale: Locale) {
  return localizePath(TOOLS_HUB_PATH, locale);
}

export function LeadMagnetsList({ locale = "fr" }: ToolsLocaleProps) {
  return (
    <ul className="mt-6 space-y-3">
      {LEAD_MAGNETS.map((base) => {
        const magnet = getLeadMagnet(base.slug, locale)!;
        return (
        <li key={magnet.slug}>
          <Link
            href={localizePath(magnet.path, locale)}
            className="group flex gap-4 rounded-2xl border border-white/8 bg-[#0c1220]/60 p-5 transition-colors hover:border-sky-500/25 hover:bg-[#0c1220]/90"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
              <FileDown className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold text-white group-hover:text-sky-300">
                  {magnet.title}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400" />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                {magnet.subtitle}
              </span>
              <span className="mt-2 inline-block text-xs text-slate-500">{magnet.format}</span>
            </span>
          </Link>
        </li>
        );
      })}
    </ul>
  );
}

export function ToolsHub({ locale = "fr" }: ToolsLocaleProps) {
  const copy = getToolsCopy(locale);
  const resourcesPath = localizePath("/ressources", locale);

  return (
    <section className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>{copy.sectionLabel}</SectionLabel>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">{copy.heading}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">{copy.intro}</p>
        <LeadMagnetsList locale={locale} />
        <p className="mt-8 text-sm text-slate-500">
          {copy.contextPrefix}{" "}
          <Link href={resourcesPath} className="text-sky-400 hover:text-sky-300">
            {copy.contextLink}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export function ToolsHubTeaser({ locale = "fr" }: ToolsLocaleProps) {
  const featured = LEAD_MAGNETS[0];
  if (!featured) return null;

  const magnet = getLeadMagnet(featured.slug, locale)!;
  const copy = getToolsCopy(locale);
  const toolsHubPath = getToolsHubPath(locale);

  return (
    <section className="pb-14 pt-10 sm:pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-400">
          {copy.sectionLabel}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{copy.heading}</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-400">{copy.teaserIntro}</p>

        <div className="mt-6">
          <Link
            href={localizePath(magnet.path, locale)}
            className="group flex gap-4 rounded-2xl border border-white/8 bg-[#0c1220]/60 p-5 transition-colors hover:border-sky-500/25 hover:bg-[#0c1220]/90"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
              <FileDown className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold text-white group-hover:text-sky-300">
                  {magnet.title}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400" />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                {magnet.subtitle}
              </span>
            </span>
          </Link>
        </div>

        <p className="mt-4">
          <Link
            href={toolsHubPath}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            {copy.seeAll}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  );
}
