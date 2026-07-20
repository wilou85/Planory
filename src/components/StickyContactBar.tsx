"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, MessageSquare } from "lucide-react";
import { getContactPath } from "@/lib/contact-nav";
import { getLocaleFromPath, getStickyContactCopy } from "@/lib/i18n";

type StickyContactBarProps = {
  hasTabBar?: boolean;
};

export function StickyContactBar({ hasTabBar = true }: StickyContactBarProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const copy = getStickyContactCopy(getLocaleFromPath(pathname));
  const contactPath = getContactPath(getLocaleFromPath(pathname));

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 z-40 px-3 lg:hidden"
      style={{
        bottom: hasTabBar
          ? "calc(3.75rem + env(safe-area-inset-bottom, 0px))"
          : "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto max-w-lg rounded-2xl border border-white/15 bg-[#0c1220]/95 p-2 shadow-2xl backdrop-blur-xl">
        <Link
          href={contactPath}
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
