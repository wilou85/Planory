"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleHelp, FileText, Mail } from "lucide-react";
import { PlanoryLogo } from "@/components/PlanoryLogo";
import { IconBox } from "@/components/ui/IconBox";
import { getSitePlanPages } from "@/lib/site";
import { getPageIcon } from "@/lib/icons";
type FooterProps = {
  compactMobile?: boolean;
};

export function Footer({ compactMobile = false }: FooterProps) {
  const pages = getSitePlanPages();
  const [sitemapOpen, setSitemapOpen] = useState(false);

  return (
    <footer
      className={`border-t border-white/10 py-8 ${
        compactMobile ? "pb-[calc(1rem+env(safe-area-inset-bottom))]" : "pb-[calc(5rem+env(safe-area-inset-bottom))]"
      } lg:pb-10`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
            <PlanoryLogo size={32} />
            <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-right">
              Planning augmenté par l&apos;IA — solution française pour la planification
              d&apos;équipes et de ressources en environnement réglementé.
            </p>
          </div>

          <nav aria-label="Plan du site Planory">
            <button
              type="button"
              onClick={() => setSitemapOpen((v) => !v)}
              className="mb-4 flex min-h-[44px] w-full items-center justify-between gap-2 text-left lg:pointer-events-none lg:cursor-default"
              aria-expanded={sitemapOpen}
            >
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                Plan du site
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform lg:hidden ${sitemapOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            <ul
              className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${sitemapOpen ? "grid" : "hidden lg:grid"}`}
            >
              {pages.map((page) => {
                const PageIcon = getPageIcon(page.path);
                return (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    title={page.snippet}
                    className="group flex min-h-[44px] w-full items-center gap-3 rounded-lg py-1 transition-colors"
                  >
                    <IconBox
                      icon={PageIcon}
                      size="sm"
                      className="text-slate-400 group-hover:border-sky-500/30 group-hover:text-sky-400"
                    />
                    <span className="text-sm font-medium text-white group-hover:text-sky-300">
                      {page.label}
                    </span>
                  </Link>
                </li>
              );
              })}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Planory — France</p>
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-end">
            <Link href="/faq" className="inline-flex items-center gap-1 transition-colors hover:text-white">
              <CircleHelp className="h-3.5 w-3.5" aria-hidden />
              FAQ
            </Link>
            <span aria-hidden>·</span>
            <a
              href="mailto:contact@planory.net"
              className="inline-flex items-center gap-1 transition-colors hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden />
              contact@planory.net
            </a>
            <span aria-hidden>·</span>
            <Link href="/llms.txt" className="inline-flex items-center gap-1 transition-colors hover:text-white">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              llms.txt
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
