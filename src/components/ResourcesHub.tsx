import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IconBox } from "@/components/ui/IconBox";
import { ContactButton } from "@/components/ContactButton";
import { ToolsHubTeaser } from "@/components/lead-magnets/LeadMagnetsSection";
import { getPageUi } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";
import { getResourceArticles } from "@/lib/resources";
import { RESOURCE_ARTICLE_ICONS } from "@/lib/icons";

type ResourcesHubProps = {
  locale?: Locale;
};

export function ResourcesHub({ locale = "fr" }: ResourcesHubProps) {
  const ui = getPageUi(locale).resources;
  const articles = getResourceArticles(locale);

  return (
    <section className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionLabel>{ui.sectionLabel}</SectionLabel>
        <h1 className="text-fluid-heading font-bold text-white">{ui.heading}</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-400">{ui.intro}</p>

        {articles.length > 0 ? (
          <ul className="mt-6 space-y-3">
            {articles.map((article) => {
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
                        {article.readTime} {ui.readTimeSuffix}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/8 bg-[#0c1220]/60 p-6 text-center">
            <p className="text-base text-slate-400">{ui.emptyMessage}</p>
            <div className="mt-4">
              <ContactButton variant="secondary" showArrow>
                {ui.emptyCta}
              </ContactButton>
            </div>
          </div>
        )}
      </div>
      <ToolsHubTeaser locale={locale} />
    </section>
  );
}
