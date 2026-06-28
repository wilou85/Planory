"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ContactButton } from "@/components/ContactButton";
import { PlanoryLogo } from "@/components/PlanoryLogo";
import { useNavDrawer } from "@/components/nav/NavDrawerContext";
import { getHeaderCopy, getHomeCopy, getLocaleFromPath, getNavItems, localizePath, stripLocalePrefix, type Locale } from "@/lib/i18n";
import { getNavItemIcon, TOP_NAV_ICONS } from "@/lib/icons";
import { SITE_PAGES } from "@/lib/site";

function pageSnippet(path: string, locale: Locale) {
  const base = stripLocalePrefix(path);
  const page = SITE_PAGES.find((p) => p.path === base);
  if (!page) return undefined;
  if (locale === "en") {
    const enEntry =
      getHomeCopy("en").sitePlanLabels[
        base as "/produit" | "/secteurs" | "/ressources" | "/offre" | "/faq"
      ];
    return enEntry?.snippet ?? page.snippet;
  }
  return page.snippet;
}

const navLinkClass = (isActive: boolean) =>
  `inline-flex h-9 items-center rounded-lg px-3.5 text-sm transition-colors ${
    isActive
      ? "bg-white/10 text-white"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  }`;

type NavChild = { label: string; href: string; description: string };
type NavItem =
  | { label: string; href: string; children: readonly NavChild[] }
  | { label: string; href: string };

type NavDropdownProps = {
  item: NavItem & { children: readonly NavChild[] };
  isActive: boolean;
};

function NavDropdown({ item, isActive }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const NavIcon = TOP_NAV_ICONS[stripLocalePrefix(item.href)];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`${navLinkClass(isActive)} gap-1.5`}
      >
        {NavIcon && <NavIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />}
        {item.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-10 -translate-x-1/2 pt-2"
          >
            <div className="w-72 rounded-xl border border-white/10 bg-[#0c1220]/95 p-2 shadow-2xl backdrop-blur-xl">
              {item.children.map((child) => {
                const ChildIcon = getNavItemIcon(child.href);
                return (
                <Link
                  key={child.label}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className="flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400">
                    <ChildIcon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white">{child.label}</span>
                    <span className="block text-xs text-slate-400">{child.description}</span>
                  </span>
                </Link>
              );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale: Locale = getLocaleFromPath(pathname);
  const copy = getHeaderCopy(locale);
  const navItems = getNavItems(locale);
  const { openDrawer, open } = useNavDrawer();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050a14]/92 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-[#050a14]/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex h-14 w-full items-center justify-between gap-3 px-4 sm:h-[3.75rem] sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex min-w-0 items-center gap-2 lg:justify-self-start">
          <button
            type="button"
            onClick={openDrawer}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label={copy.openMenu}
            aria-controls="mobile-nav-drawer"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
          <PlanoryLogo size={36} locale={locale} />
        </div>

        <nav
          className="hidden items-center gap-0.5 lg:flex lg:justify-self-center"
          aria-label={copy.mainNav}
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            if ("children" in item) {
              return <NavDropdown key={item.label} item={item} isActive={isActive} />;
            }
            const NavIcon = TOP_NAV_ICONS[stripLocalePrefix(item.href)];
            return (
              <Link
                key={item.label}
                href={item.href}
                title={pageSnippet(item.href, locale)}
                className={`${navLinkClass(isActive)} gap-1.5`}
              >
                {NavIcon && <NavIcon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-1.5 lg:justify-self-end lg:gap-2">
          <Button
            href={localizePath("/produit#planning", locale)}
            variant="ghost"
            size="sm"
            className="!hidden lg:!inline-flex"
          >
            {copy.ctaExample}
          </Button>
          <ContactButton variant="primary" size="sm">
            <span className="hidden sm:inline">{copy.ctaContact}</span>
            <span className="sm:hidden">{copy.ctaContactShort}</span>
          </ContactButton>
        </div>
      </div>
    </header>
  );
}
