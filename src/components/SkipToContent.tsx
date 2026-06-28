"use client";

import { usePathname } from "next/navigation";
import { getPageUi } from "@/lib/get-content";
import { getLocaleFromPath } from "@/lib/i18n";

export function SkipToContent() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const label = getPageUi(locale).layout.skipToContent;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-[#050a14]"
    >
      {label}
    </a>
  );
}
