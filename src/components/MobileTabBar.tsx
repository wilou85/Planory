"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Home, MapPin, MoreHorizontal } from "lucide-react";
import { getHeaderCopy, getLocaleFromPath, getMobileTabItems, stripLocalePrefix } from "@/lib/i18n";
import { SITE_PAGES } from "@/lib/site";
import { useNavDrawer } from "@/components/nav/NavDrawerContext";
import type { LucideIcon } from "lucide-react";

function tabIcon(href: string): LucideIcon {
  const base = stripLocalePrefix(href);
  if (base === "/") return Home;
  if (base.startsWith("/produit")) return Box;
  if (base.startsWith("/secteurs")) return MapPin;
  return Home;
}

export function MobileTabBar() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const copy = getHeaderCopy(locale);
  const tabs = getMobileTabItems(locale).map((tab) => ({
    ...tab,
    title: SITE_PAGES.find((p) => p.path === stripLocalePrefix(tab.href))?.snippet ?? tab.label,
    icon: tabIcon(tab.href),
  }));
  const { openDrawer, open } = useNavDrawer();

  const moreActive =
    !tabs.some(
      (t) => pathname === t.href || (t.href !== "/" && t.href !== "/en" && pathname.startsWith(`${t.href}/`)),
    ) && pathname !== "/" && pathname !== "/en";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-[#050a14]/95 backdrop-blur-xl lg:hidden"
      aria-label={copy.mobileNavLabel}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 sm:max-w-xl">
        {tabs.map(({ href, label, title, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/" && href !== "/en" && pathname.startsWith(`${href}/`));
          return (
            <li key={href} className="min-w-0 flex-1">
              <Link
                href={href}
                title={title}
                className="relative flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium"
                aria-current={active ? "page" : undefined}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-tab-indicator"
                    className="absolute inset-x-3 top-1 h-0.5 rounded-full bg-sky-400"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon
                  className={`h-5 w-5 ${active ? "text-sky-400" : "text-slate-500"}`}
                  aria-hidden
                />
                <span className={active ? "text-white" : "text-slate-400"}>{label}</span>
              </Link>
            </li>
          );
        })}
        <li className="min-w-0 flex-1">
          <button
            type="button"
            onClick={openDrawer}
            title={copy.moreTabTitle}
            className="relative flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium"
            aria-controls="mobile-nav-drawer"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            {moreActive && (
              <motion.span
                layoutId="mobile-tab-indicator"
                className="absolute inset-x-3 top-1 h-0.5 rounded-full bg-sky-400"
              />
            )}
            <MoreHorizontal
              className={`h-5 w-5 ${moreActive ? "text-sky-400" : "text-slate-500"}`}
              aria-hidden
            />
            <span className={moreActive ? "text-white" : "text-slate-400"}>{copy.moreTab}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
