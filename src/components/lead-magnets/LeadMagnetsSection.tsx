import Link from "next/link";
import { ArrowRight, FileDown } from "lucide-react";
import { sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LEAD_MAGNETS, TOOLS_HUB_PATH } from "@/lib/lead-magnets";

export function LeadMagnetsList() {
  return (
    <ul className="mt-6 space-y-3">
      {LEAD_MAGNETS.map((magnet) => (
        <li key={magnet.slug}>
          <Link
            href={magnet.path}
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
      ))}
    </ul>
  );
}

export function ToolsHub() {
  return (
    <section className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>Outils gratuits</SectionLabel>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Ressources à télécharger</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          Grilles, modèles et checklists pour cadrer votre projet de planification — PDF gratuit,
          sans téléphone obligatoire.
        </p>
        <LeadMagnetsList />
        <p className="mt-8 text-sm text-slate-500">
          Besoin de contexte avant de tester ? Consultez nos{" "}
          <Link href="/ressources" className="text-sky-400 hover:text-sky-300">
            guides planification
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export function ToolsHubTeaser() {
  const featured = LEAD_MAGNETS[0];
  if (!featured) return null;

  return (
    <section className="pb-14 pt-10 sm:pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-sky-400">
          Outils gratuits
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Ressources à télécharger
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-400">
          Grilles et modèles pour cadrer votre projet — PDF gratuit, sans téléphone obligatoire.
        </p>

        <div className="mt-6">
          <Link
            href={featured.path}
            className="group flex gap-4 rounded-2xl border border-white/8 bg-[#0c1220]/60 p-5 transition-colors hover:border-sky-500/25 hover:bg-[#0c1220]/90"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
              <FileDown className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-semibold text-white group-hover:text-sky-300">
                  {featured.title}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400" />
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                {featured.subtitle}
              </span>
            </span>
          </Link>
        </div>

        <p className="mt-4">
          <Link
            href={TOOLS_HUB_PATH}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            Voir tous les outils
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  );
}
