/**
 * Routage public FR sans préfixe / EN avec /en.
 * Utilisé par next.config (rewrites/redirects) — pas de proxy Edge.
 */
export function shouldBypassLocaleRouting(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/llms") ||
    pathname.includes(".")
  );
}

/** Redirections canoniques : /fr → URL publique sans préfixe */
export const LOCALE_REDIRECTS = [
  { source: "/fr", destination: "/", permanent: false },
  { source: "/fr/:path*", destination: "/:path*", permanent: false },
] as const;

/**
 * Rewrites internes vers `[locale]=fr`.
 * Exclut api, _next, en, fr, et fichiers avec extension (assets / llms.txt).
 */
export const LOCALE_REWRITES = [
  { source: "/", destination: "/fr" },
  {
    source: "/((?!api|_next|en|fr|.*\\..*).*)",
    destination: "/fr/$1",
  },
] as const;

/** Miroir de la logique historique du proxy — pour tests unitaires */
export function resolveLocaleRouting(pathname: string): {
  type: "next" | "redirect" | "rewrite";
  to?: string;
} {
  if (shouldBypassLocaleRouting(pathname)) {
    return { type: "next" };
  }
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    return {
      type: "redirect",
      to: pathname === "/fr" ? "/" : pathname.slice(3) || "/",
    };
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return { type: "next" };
  }
  return {
    type: "rewrite",
    to: pathname === "/" ? "/fr" : `/fr${pathname}`,
  };
}
