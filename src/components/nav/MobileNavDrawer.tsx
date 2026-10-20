"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePublicPathname } from "@/components/usePublicPathname";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail } from "lucide-react";
import { getDrawerNavSections, getHeaderCopy, getLocaleFromPath } from "@/lib/i18n";
import { getContactMailtoHref } from "@/lib/contact-nav";
import { trackContactClick } from "@/components/analytics/TrackedContactLink";
import { getNavItemIcon } from "@/lib/icons";
import { handleSameRouteHashClick } from "@/lib/same-route-hash";
import { useNavDrawer } from "@/components/nav/NavDrawerContext";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileNavDrawer() {
  const { open, closeDrawer } = useNavDrawer();
  const pathname = usePublicPathname();
  const locale = getLocaleFromPath(pathname);
  const copy = getHeaderCopy(locale);
  const drawerSections = getDrawerNavSections(locale);
  const panelRef = useRef<HTMLElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Le drawer est masqué en CSS dès md : sans ça, le scroll du body resterait bloqué.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 48rem)");
    const sync = () => {
      if (mq.matches) closeDrawer();
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [open, closeDrawer]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => {
            if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") {
              return false;
            }
            // offsetParent est null pour les fixed — utiliser getClientRects
            return el.getClientRects().length > 0;
          })
        : [];

    const focusFirst = () => {
      const items = focusables();
      (items[0] ?? panel)?.focus();
    };

    // Wait for motion mount / layout
    const t = window.setTimeout(focusFirst, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
      previouslyFocused.current = null;
    };
  }, [open, closeDrawer]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label={copy.closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeDrawer}
            tabIndex={-1}
          />
          <motion.nav
            ref={panelRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={copy.mobileNav}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,20rem)] flex-col border-l border-white/10 bg-[#0c1220] shadow-2xl outline-none md:hidden"
            style={{ paddingTop: "var(--safe-top)" }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold text-white">{copy.menu}</span>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label={copy.close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              {drawerSections.map((section) => (
                <div key={section.title} className="mb-6 last:mb-0">
                  <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                    {section.title}
                  </p>
                  <ul className="space-y-0.5">
                    {section.items.map((item) => {
                      const ItemIcon = getNavItemIcon(item.href);
                      const baseHref = item.href.split("#")[0];
                      const isActive =
                        pathname === item.href ||
                        pathname === baseHref ||
                        (baseHref !== "/" && pathname.startsWith(`${baseHref}/`));
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={(e) => {
                              handleSameRouteHashClick(item.href, e);
                              closeDrawer();
                            }}
                            className={`flex min-h-[44px] items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                              isActive
                                ? "bg-white/10 text-white"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400">
                              <ItemIcon className="h-4 w-4" aria-hidden />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium">{item.label}</span>
                              {"description" in item && !!item.description && (
                                <span className="mt-0.5 block text-xs text-slate-500">
                                  {item.description}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className="p-4"
              style={{ paddingBottom: "calc(1rem + var(--safe-bottom))" }}
            >
              <Link
                href={getContactMailtoHref(locale)}
                onClick={() => {
                  trackContactClick("mobile_menu");
                  closeDrawer();
                }}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white text-sm font-medium text-[#050a14]"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {copy.ctaContact}
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
