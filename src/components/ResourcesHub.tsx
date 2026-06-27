import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IconBox } from "@/components/ui/IconBox";
import { RESOURCE_ARTICLES } from "@/lib/resources";
import { RESOURCE_ARTICLE_ICONS } from "@/lib/icons";

export function ResourcesHub() {
  return (
    <section className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>Ressources</SectionLabel>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Guides planification &amp; planning équipes
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">
          Articles pratiques sur la planification d&apos;équipes, les astreintes, les
          roulements 24/7 et le passage d&apos;Excel à un logiciel de planning.
        </p>

        <ul className="mt-6 space-y-3">
          {RESOURCE_ARTICLES.map((article) => {
            const ArticleIcon = RESOURCE_ARTICLE_ICONS[article.slug] ?? BookOpen;
            return (
            <li key={article.slug}>
              <Link
                href={article.path}
                className="group flex gap-4 rounded-2xl border border-white/8 bg-[#0c1220]/60 p-6 transition-colors hover:border-white/15 hover:bg-[#0c1220]/90"
              >
                <IconBox
                  icon={ArticleIcon}
                  className="text-sky-400 group-hover:border-sky-500/30"
                />
                <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-lg font-semibold text-white group-hover:text-sky-300">
                    {article.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400" />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-slate-400">
                  {article.description}
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-3 w-3" aria-hidden />
                  {article.readTime} de lecture
                </span>
                </span>
              </Link>
            </li>
          );
          })}
        </ul>
      </div>
    </section>
  );
}
