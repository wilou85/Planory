"use client";

import { motion } from "framer-motion";
import { IconBox } from "@/components/ui/IconBox";
import type { Locale } from "@/lib/i18n";
import { getProductModules } from "@/lib/get-content";
import { PRODUCT_MODULE_ICONS } from "@/lib/icons";

type ProductModulePanelProps = {
  moduleId: string;
  locale?: Locale;
};

export function ProductModulePanel({ moduleId, locale = "fr" }: ProductModulePanelProps) {
  const modules = getProductModules(locale);
  const mod = modules.find((m) => m.id === moduleId) ?? modules[0];
  if (!mod) return null;

  const ModIcon = PRODUCT_MODULE_ICONS[mod.id];

  return (
    <motion.div
      key={mod.id}
      id={mod.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-8 scroll-mt-28 rounded-2xl border border-white/10 bg-[#0c1220]/60 p-6 sm:p-8"
      role="region"
      aria-labelledby={`module-heading-${mod.id}`}
    >
      <div className="flex gap-4 sm:gap-5">
        <IconBox
          icon={ModIcon}
          className="shrink-0 border-sky-500/25 bg-sky-500/10 text-sky-400"
        />
        <div className="min-w-0">
          <h3 id={`module-heading-${mod.id}`} className="text-xl font-bold text-white sm:text-2xl">
            {mod.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-slate-400">{mod.description}</p>
          {"details" in mod && mod.details && mod.details.length > 0 && (
            <ul className="mt-6 space-y-4 border-t border-white/8 pt-6">
              {mod.details.map((detail) => (
                <li key={detail.title}>
                  <p className="text-sm font-medium text-slate-300">{detail.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{detail.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
