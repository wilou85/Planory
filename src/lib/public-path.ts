/**
 * French pages are rewritten internally to `/fr/...` before `[locale]` runs.
 * `usePathname()` then returns that internal path, so public links must strip it.
 */
export function toPublicPathname(pathname: string): string {
  if (pathname === "/fr") return "/";
  if (pathname.startsWith("/fr/")) {
    const rest = pathname.slice(3);
    return rest.length > 0 ? rest : "/";
  }
  return pathname || "/";
}
