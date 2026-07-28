"use client";

import { useLayoutEffect } from "react";
import type { Locale } from "@/lib/i18n";

/** Keep <html lang> in sync when nested under the root layout. */
export function DocumentLocale({ locale }: { locale: Locale }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
