import { normalizeLoginCode } from "@/lib/admin-auth/login-code";
import type { AdminUser } from "@/lib/admin-auth/users";

export type LoginOutcome =
  | { status: "ok"; user: AdminUser }
  | { status: "invalid" }
  | { status: "code_sent"; email: string }
  | { status: "code_pending"; email: string }
  | { status: "code_send_failed" }
  | { status: "code_invalid" };

type LoginDeps = {
  findUser: (email: string) => Promise<AdminUser | null>;
  verifyPassword: (password: string, hash: string) => Promise<boolean>;
  issueCode: (userId: string) => Promise<string | null>;
  verifyCode: (userId: string, code: string) => Promise<boolean>;
  sendCode: (user: AdminUser, code: string) => Promise<boolean>;
};

/**
 * The client IP comes from X-Forwarded-For, which a client can forge: the account key
 * keeps password and e-mail-code guessing bounded whatever IP is claimed.
 */
export function loginThrottleKeys(input: { ip: string; email: string }) {
  return {
    ip: `admin-login:${input.ip}`,
    account: `admin-login-account:${input.email.trim().toLowerCase()}`,
  };
}

/** Password first, then a single-use code e-mailed to the account: both are always required. */
export async function authenticateAdmin(
  input: { email: string; password: string; code?: string },
  deps: LoginDeps,
): Promise<LoginOutcome> {
  if (!input.email.trim() || !input.password) return { status: "invalid" };

  const user = await deps.findUser(input.email);
  if (!user || !(await deps.verifyPassword(input.password, user.passwordHash))) {
    return { status: "invalid" };
  }

  if (input.code === undefined) {
    const code = await deps.issueCode(user.id);
    if (code === null) return { status: "code_pending", email: user.email };
    return (await deps.sendCode(user, code))
      ? { status: "code_sent", email: user.email }
      : { status: "code_send_failed" };
  }

  const code = normalizeLoginCode(input.code);
  if (!/^\d{6}$/.test(code) || !(await deps.verifyCode(user.id, code))) {
    return { status: "code_invalid" };
  }
  return { status: "ok", user };
}
