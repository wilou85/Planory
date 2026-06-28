"use client";

import { useEffect } from "react";

type SetHtmlLangProps = {
  lang: string;
};

export function SetHtmlLang({ lang }: SetHtmlLangProps) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.lang;
    root.lang = lang;
    return () => {
      root.lang = previous;
    };
  }, [lang]);

  return null;
}
