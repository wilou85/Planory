/**
 * Same-route hash navigation for Next.js App Router.
 * Soft navigations use history.pushState and do not fire `hashchange`;
 * assigning `location.hash` does.
 */

export function applySameRouteHash(hash: string) {
  const next = hash.startsWith("#") ? hash : `#${hash}`;
  if (window.location.hash !== next) {
    window.location.hash = next;
  } else {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

/** @returns true if the click was handled as same-route hash navigation */
export function handleSameRouteHashClick(
  href: string,
  e: { preventDefault: () => void },
): boolean {
  if (typeof window === "undefined") return false;

  if (href.startsWith("#")) {
    e.preventDefault();
    applySameRouteHash(href);
    return true;
  }

  try {
    const target = new URL(href, window.location.href);
    if (
      target.origin === window.location.origin &&
      target.pathname === window.location.pathname &&
      target.hash
    ) {
      e.preventDefault();
      applySameRouteHash(target.hash);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
