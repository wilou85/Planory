"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Home, MapPin, MoreHorizontal } from "lucide-react";
import { MOBILE_TAB_ITEMS } from "@/lib/content";
import { SITE_PAGES } from "@/lib/site";
import { useNavDrawer } from "@/components/nav/NavDrawerContext";

const TAB_ICONS = {
  "/": Home,
  "/produit": Box,
  "/secteurs": MapPin,
} as const;

const TABS = MOBILE_TAB_ITEMS.map((tab) => ({
  ...tab,
  title: SITE_PAGES.find((p) => p.path === tab.href)?.snippet ?? tab.label,
  icon: TAB_ICONS[tab.href as keyof typeof TAB_ICONS],
}));

export function MobileTabBar() {
  const pathname = usePathname();
  const { openDrawer } = useNavDrawer();

  const moreActive =
    !TABS.some(
      (t) => pathname === t.href || (t.href !== "/" && pathname.startsWith(`${t.href}/`)),
    ) && pathname !== "/";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-[#050a14]/95 backdrop-blur-xl lg:hidden"
      aria-label="Navigation mobile"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 sm:max-w-xl">
        {TABS.map(({ href, label, title, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
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
            title="Articles, Offre, FAQ…"
            className="relative flex min-h-[56px] w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium"
            aria-controls="mobile-nav-drawer"
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
            <span className={moreActive ? "text-white" : "text-slate-400"}>Plus</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
