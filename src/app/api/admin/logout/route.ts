import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  clearAdminSessionCookieOptions,
  isSecureCookieRequest,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    clearAdminSessionCookieOptions({
      secure: isSecureCookieRequest(request),
    }),
  );
  return response;
}
