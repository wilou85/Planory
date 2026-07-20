import { NextRequest, NextResponse } from "next/server";

/**
 * Public URLs stay unprefixed for FR (`/produit`) and `/en`-prefixed for EN.
 * Internally, FR is rewritten to `/fr/...` so the App Router matches `[locale]`.
 *
 * Next.js 16 : convention `proxy` (ex-`middleware`).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/llms") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Avoid duplicate FR URLs under /fr
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/fr" ? "/" : pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const response = NextResponse.next();
    response.headers.set("x-locale", "en");
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fr" : `/fr${pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-locale", "fr");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
