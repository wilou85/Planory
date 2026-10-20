/** Soft-scroll when clicking a hash that targets the current route. */
export function handleSameRouteHashClick(
  href: string,
  event: { preventDefault: () => void },
): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (url.pathname !== window.location.pathname) return;
    if (!url.hash) return;
    event.preventDefault();
    const id = decodeURIComponent(url.hash.slice(1));
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = url.hash;
  } catch {
    /* ignore */
  }
}
