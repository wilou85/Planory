import { SignJWT, jwtVerify } from "jose";

export type AdminRole = "admin";

export type AdminTokenPayload = {
  sub: string;
  email: string;
  role: AdminRole;
};

export type AdminJwtOptions = {
  secret: string;
  /** Seconds until expiry. Default 7 days. */
  expiresInSec?: number;
};

const DEFAULT_TTL_SEC = 60 * 60 * 24 * 7;

function secretKey(secret: string): Uint8Array {
  if (!secret.trim()) {
    throw new Error("ADMIN_JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(
  payload: AdminTokenPayload,
  options: AdminJwtOptions,
): Promise<string> {
  const key = secretKey(options.secret);
  const ttl = options.expiresInSec ?? DEFAULT_TTL_SEC;
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(key);
}

export async function verifyAdminToken(
  token: string,
  options: Pick<AdminJwtOptions, "secret">,
): Promise<AdminTokenPayload | null> {
  if (!token || !options.secret?.trim()) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(options.secret), {
      algorithms: ["HS256"],
    });
    const sub = typeof payload.sub === "string" ? payload.sub : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    const role = payload.role === "admin" ? "admin" : null;
    if (!sub || !email || !role) return null;
    return { sub, email, role };
  } catch {
    return null;
  }
}

export function getAdminJwtSecret(): string {
  return process.env.ADMIN_JWT_SECRET?.trim() ?? "";
}
