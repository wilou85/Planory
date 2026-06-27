import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IconBox } from "@/components/ui/IconBox";
import { sectionY } from "@/components/ui/section";
import { getSitePlanPages } from "@/lib/site";
import { getPageIcon } from "@/lib/icons";

export function DiscoverPlanory() {
  const pages = getSitePlanPages();

  return (
    <section
      aria-labelledby="discover-planory-heading"
      className={`border-t border-white/10 ${sectionY}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="discover-planory-heading"
          className="text-xl font-bold text-white sm:text-2xl"
        >
          Découvrir Planory
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Planory accélère la planification sans remplacer l&apos;expertise. L&apos;IA propose,
          vous décidez.
        </p>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const PageIcon = getPageIcon(page.path);
            return (
              <li key={page.path}>
                <Link
                  href={page.path}
                  title={page.snippet}
                  className="group flex items-center gap-3 rounded-xl border border-white/8 bg-[#0c1220]/50 px-4 py-3 transition-colors hover:border-white/15 hover:bg-[#0c1220]/80"
                >
                  <IconBox
                    icon={PageIcon}
                    size="sm"
                    className="text-sky-400 group-hover:border-sky-500/30"
                  />
                  <span className="min-w-0 flex-1 text-sm font-semibold text-white group-hover:text-sky-300">
                    {page.label}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-sky-400"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
