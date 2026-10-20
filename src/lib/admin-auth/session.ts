import type { AdminTokenPayload } from "@/lib/admin-auth/jwt";
import { getAdminJwtSecret, verifyAdminToken } from "@/lib/admin-auth/jwt";

export const ADMIN_SESSION_COOKIE = "planory_admin_session";

const SEVEN_DAYS_SEC = 60 * 60 * 24 * 7;

export type AdminCookieOptions = {
  httpOnly: true;
  sameSite: "lax";
  path: "/";
  secure: boolean;
  maxAge: number;
};

export function createAdminSessionCookieOptions(opts: {
  secure: boolean;
  maxAgeSec?: number;
}): AdminCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: opts.secure,
    maxAge: opts.maxAgeSec ?? SEVEN_DAYS_SEC,
  };
}

export function clearAdminSessionCookieOptions(opts: {
  secure: boolean;
}): AdminCookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: opts.secure,
    maxAge: 0,
  };
}

export function isSecureCookieRequest(request?: { url?: string; headers?: Headers }): boolean {
  if (process.env.NODE_ENV === "production") return true;
  const proto = request?.headers?.get("x-forwarded-proto");
  if (proto === "https") return true;
  try {
    if (request?.url && new URL(request.url).protocol === "https:") return true;
  } catch {
    /* ignore */
  }
  return false;
}

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

export async function readAdminSession(
  cookies: CookieReader,
  secret = getAdminJwtSecret(),
): Promise<AdminTokenPayload | null> {
  const token = cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token, { secret });
}
