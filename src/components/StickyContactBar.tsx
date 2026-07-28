"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageSquare } from "lucide-react";
import { getContactMailtoHref } from "@/lib/contact-nav";
import { getLocaleFromPath, getStickyContactCopy } from "@/lib/i18n";

type StickyContactBarProps = {
  hasTabBar?: boolean;
};

export function StickyContactBar({ hasTabBar = true }: StickyContactBarProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const copy = getStickyContactCopy(locale);
  const contactHref = getContactMailtoHref(locale);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  /**
   * Avec la tab bar : barre accolée (même fond, bord partagé) pour lire comme
   * un seul chrome bas. Sans tab bar : îlot flottant.
   */
  return (
    <div
      className={`fixed inset-x-0 z-40 md:hidden ${
        hasTabBar
          ? "min-h-[var(--contactbar-h)] border-t border-white/10 bg-[#050a14]/95 px-3 py-1.5 backdrop-blur-xl"
          : "px-3"
      }`}
      style={{
        bottom: hasTabBar
          ? "calc(var(--tabbar-h) + var(--safe-bottom))"
          : "calc(0.75rem + var(--safe-bottom))",
      }}
    >
      <div
        className={
          hasTabBar
            ? "mx-auto max-w-lg"
            : "mx-auto max-w-lg rounded-2xl border border-white/15 bg-[#0c1220]/95 p-2 shadow-2xl backdrop-blur-xl"
        }
      >
        <Link
          href={contactHref}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-[#050a14]"
        >
          <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
          <span>{copy.primaryShort}</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
