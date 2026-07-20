"use client";

import { useEffect, useRef } from "react";
import { getPageUi, getProductModules } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";
import { PRODUCT_MODULE_ICONS } from "@/lib/icons";

type ProductModuleChipsProps = {
  locale?: Locale;
  activeModuleId: string;
  onSelectModule: (moduleId: string) => void;
};

/** Sélecteur modules produit — scroll horizontal mobile (< lg). */
export function ProductModuleChips({
  locale = "fr",
  activeModuleId,
  onSelectModule,
}: ProductModuleChipsProps) {
  const ui = getPageUi(locale);
  const modules = getProductModules(locale);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    active?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeModuleId]);

  return (
    <nav aria-label={ui.productSidebar.navAriaLabel} className="mt-8 lg:hidden">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
        {ui.productSidebar.label}
      </p>
      <div className="-mx-4 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul ref={listRef} className="flex w-max gap-2 pb-1">
          {modules.map((mod) => {
            const ModIcon = PRODUCT_MODULE_ICONS[mod.id];
            const isActive = mod.id === activeModuleId;
            return (
              <li key={mod.id}>
                <button
                  type="button"
                  onClick={() => onSelectModule(mod.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm transition-colors ${
                    isActive
                      ? "bg-white/15 font-medium text-white ring-1 ring-white/20"
                      : "bg-white/5 text-slate-400 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ModIcon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-sky-400" : "text-slate-500"}`}
                    aria-hidden
                  />
                  {mod.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
