import { db } from "@/lib/db";
import { getAdminJwtSecret, type AdminRole } from "@/lib/admin-auth/jwt";
import { createLoginCodeStore } from "@/lib/admin-auth/login-code";

export type AdminUser = {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
};

type AdminRow = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
};

function toAdminUser(row: AdminRow | undefined): AdminUser | null {
  if (!row || row.role !== "admin") return null;
  return { id: row.id, email: row.email, passwordHash: row.password_hash, role: "admin" };
}

const SELECT_ADMIN = `SELECT id, email, password_hash, role FROM public.admin_users`;

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  const result = await db.query<AdminRow>(`${SELECT_ADMIN} WHERE email = $1 LIMIT 1`, [normalized]);
  return toAdminUser(result.rows[0]);
}

export async function findAdminById(id: string): Promise<AdminUser | null> {
  const result = await db.query<AdminRow>(`${SELECT_ADMIN} WHERE id = $1 LIMIT 1`, [id]);
  return toAdminUser(result.rows[0]);
}

export async function touchLastLogin(userId: string): Promise<void> {
  await db.query(
    `UPDATE public.admin_users SET last_login_at = now() WHERE id = $1`,
    [userId],
  );
}

export const loginCodes = createLoginCodeStore((text, params) => db.query(text, params), getAdminJwtSecret);

export type LoginEvent = {
  userId: string | null;
  email: string;
  success: boolean;
  reason?: string;
  ip: string;
  userAgent: string;
};

export async function recordLoginEvent(event: LoginEvent): Promise<void> {
  await db.query(
    `INSERT INTO public.admin_login_events (user_id, email, success, reason, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      event.userId,
      event.email.trim().toLowerCase().slice(0, 254),
      event.success,
      event.reason ?? null,
      event.ip.slice(0, 64),
      event.userAgent.slice(0, 300),
    ],
  );
}

export type RecentLogin = {
  at: string;
  email: string;
  success: boolean;
  reason: string | null;
  ip: string | null;
  userAgent: string | null;
};

export async function listRecentLogins(limit = 15): Promise<RecentLogin[]> {
  const result = await db.query<{
    created_at: Date;
    email: string;
    success: boolean;
    reason: string | null;
    ip: string | null;
    user_agent: string | null;
  }>(
    `SELECT created_at, email, success, reason, ip, user_agent
     FROM public.admin_login_events
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit],
  );
  return result.rows.map((row) => ({
    at: new Date(row.created_at).toISOString(),
    email: row.email,
    success: row.success,
    reason: row.reason,
    ip: row.ip,
    userAgent: row.user_agent,
  }));
}
