"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { sectionStack, sectionY } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProductSidebar } from "@/components/ProductSidebar";
import { ProductModulePanel } from "@/components/ProductModulePanel";
import { ProductShowcase } from "@/components/ProductShowcase";
import { getPageUi, getProductBenefits, getProductModules } from "@/lib/get-content";
import { localizePath, type Locale } from "@/lib/i18n";

type ProductSectionProps = {
  locale?: Locale;
};

export function ProductSection({ locale = "fr" }: ProductSectionProps) {
  const ui = getPageUi(locale);
  const benefits = getProductBenefits(locale);
  const modules = getProductModules(locale);
  const defaultModuleId = modules[0]?.id ?? "rh";

  const [activeModuleId, setActiveModuleId] = useState<string>(defaultModuleId);

  const selectModule = useCallback((moduleId: string) => {
    setActiveModuleId(moduleId);
    window.history.replaceState(null, "", `#${moduleId}`);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash && modules.some((m) => m.id === hash)) {
        setActiveModuleId(hash);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [modules]);

  return (
    <section id="produit" className={`relative ${sectionY}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${sectionStack} lg:flex-row`}>
          <ProductSidebar
            locale={locale}
            activeModuleId={activeModuleId}
            onSelectModule={selectModule}
          />
          <div className="min-w-0 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel>{ui.product.sectionLabel}</SectionLabel>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {ui.product.heading[0]}
                <br />
                {ui.product.heading[1]}
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-400">
                {ui.product.intro}
              </p>
            </motion.div>

            <ProductModulePanel moduleId={activeModuleId} locale={locale} />

            <ProductShowcase locale={locale} />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 max-w-3xl"
            >
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30">
                      <Check className="h-3 w-3 text-emerald-400" aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-slate-500">
                {ui.product.relatedArticles.label}{" "}
                {ui.product.relatedArticles.links.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 && " · "}
                    <Link
                      href={localizePath(link.href, locale)}
                      className="text-sky-400 hover:text-sky-300"
                    >
                      {link.label}
                    </Link>
                  </span>
                ))}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
