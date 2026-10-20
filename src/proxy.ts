import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminJwtSecret, verifyAdminToken } from "@/lib/admin-auth/jwt";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth/session";

function isAdminLoginPath(pathname: string): boolean {
  return pathname === "/admin/login" || pathname === "/admin/login/";
}

function isAdminHtmlPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isAdminHtmlPath(pathname) || isAdminLoginPath(pathname)) {
    return NextResponse.next();
  }

  const secret = getAdminJwtSecret();
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value ?? "";
  const session = secret ? await verifyAdminToken(token, { secret }) : null;

  if (session) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
