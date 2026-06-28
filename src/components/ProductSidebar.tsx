"use client";

import Link from "next/link";
import { getPageUi, getProductModules } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";
import { PRODUCT_MODULE_ICONS } from "@/lib/icons";

type ProductSidebarProps = {
  locale?: Locale;
};

export function ProductSidebar({ locale = "fr" }: ProductSidebarProps) {
  const ui = getPageUi(locale);
  const modules = getProductModules(locale);

  return (
    <nav
      aria-label={ui.productSidebar.navAriaLabel}
      className="hidden lg:block lg:w-48 lg:shrink-0 xl:w-52"
    >
      <div className="sticky top-[calc(3.5rem+1rem)] space-y-1 sm:top-[calc(3.75rem+1rem)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          {ui.productSidebar.label}
        </p>
        {modules.map((mod) => {
          const ModIcon = PRODUCT_MODULE_ICONS[mod.id];
          return (
            <Link
              key={mod.id}
              href={`#${mod.id}`}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ModIcon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              {mod.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
