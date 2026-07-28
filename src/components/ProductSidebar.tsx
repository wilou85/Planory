"use client";

import { getPageUi, getProductModules } from "@/lib/get-content";
import type { Locale } from "@/lib/i18n";
import { PRODUCT_MODULE_ICONS } from "@/lib/icons";

type ProductSidebarProps = {
  locale?: Locale;
  activeModuleId: string;
  onSelectModule: (moduleId: string) => void;
};

export function ProductSidebar({
  locale = "fr",
  activeModuleId,
  onSelectModule,
}: ProductSidebarProps) {
  const ui = getPageUi(locale);
  const modules = getProductModules(locale);

  return (
    <nav
      aria-label={ui.productSidebar.navAriaLabel}
      className="hidden lg:block lg:w-48 lg:shrink-0 xl:w-52"
    >
      <div className="sticky top-[calc(var(--header-h)+1rem)] space-y-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          {ui.productSidebar.label}
        </p>
        {modules.map((mod) => {
          const ModIcon = PRODUCT_MODULE_ICONS[mod.id];
          const isActive = mod.id === activeModuleId;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelectModule(mod.id)}
              aria-current={isActive ? "true" : undefined}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "bg-white/10 font-medium text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ModIcon
                className={`h-4 w-4 shrink-0 ${isActive ? "text-sky-400" : "text-slate-500"}`}
                aria-hidden
              />
              {mod.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
