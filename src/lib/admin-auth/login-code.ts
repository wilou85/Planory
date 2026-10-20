import { createHmac, randomInt } from "node:crypto";

export const LOGIN_CODE_TTL_MS = 10 * 60 * 1000;
export const LOGIN_CODE_MAX_ATTEMPTS = 5;
export const LOGIN_CODE_RESEND_COOLDOWN_MS = 60 * 1000;

export function normalizeLoginCode(code: string): string {
  return code.replace(/\s+/g, "");
}

export function generateLoginCode(random: (max: number) => number = randomInt): string {
  return String(random(1_000_000)).padStart(6, "0");
}

export function hashLoginCode(userId: string, code: string, secret: string): string {
  return createHmac("sha256", secret).update(`${userId}:${normalizeLoginCode(code)}`).digest("hex");
}

type Query = (text: string, params?: unknown[]) => Promise<{ rows: unknown[] }>;

/** One pending code per user, stored hashed; verification consumes it atomically. */
export function createLoginCodeStore(query: Query, getSecret: () => string) {
  return {
    /** Returns the clear code to e-mail, or null while the previous one is in its cooldown. */
    async issue(userId: string, now: Date = new Date()): Promise<string | null> {
      const code = generateLoginCode();
      const result = await query(
        `INSERT INTO public.admin_login_codes (user_id, code_hash, created_at, expires_at, attempts)
         VALUES ($1, $2, $3, $4, 0)
         ON CONFLICT (user_id) DO UPDATE
         SET code_hash = EXCLUDED.code_hash,
             created_at = EXCLUDED.created_at,
             expires_at = EXCLUDED.expires_at,
             attempts = 0
         WHERE public.admin_login_codes.created_at <= $5
         RETURNING user_id`,
        [
          userId,
          hashLoginCode(userId, code, getSecret()),
          now.toISOString(),
          new Date(now.getTime() + LOGIN_CODE_TTL_MS).toISOString(),
          new Date(now.getTime() - LOGIN_CODE_RESEND_COOLDOWN_MS).toISOString(),
        ],
      );
      return result.rows.length > 0 ? code : null;
    },

    async verify(userId: string, code: string, now: Date = new Date()): Promise<boolean> {
      const consumed = await query(
        `DELETE FROM public.admin_login_codes
         WHERE user_id = $1 AND code_hash = $2 AND expires_at > $3 AND attempts < $4
         RETURNING user_id`,
        [userId, hashLoginCode(userId, code, getSecret()), now.toISOString(), LOGIN_CODE_MAX_ATTEMPTS],
      );
      if (consumed.rows.length > 0) return true;
      await query(
        `UPDATE public.admin_login_codes SET attempts = attempts + 1 WHERE user_id = $1`,
        [userId],
      );
      return false;
    },
  };
}

export type AdminEmail = { to: string; subject: string; text: string };

export function buildLoginCodeEmail(input: {
  email: string;
  code: string;
  ip: string;
  userAgent: string;
  at: Date;
}): AdminEmail {
  const when = input.at.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "short",
    timeStyle: "short",
  });
  return {
    to: input.email,
    subject: `${input.code} — code de connexion à l'admin Planory`,
    text: [
      "Voici votre code de connexion au tableau de bord Planory :",
      "",
      `    ${input.code}`,
      "",
      `Il est valable ${LOGIN_CODE_TTL_MS / 60_000} minutes et ne peut servir qu'une fois.`,
      "",
      "Demande effectuée :",
      `Date : ${when} (heure de Paris)`,
      `Adresse IP : ${input.ip}`,
      `Navigateur : ${input.userAgent || "inconnu"}`,
      "",
      "Si ce n'est pas vous, quelqu'un connaît votre mot de passe :",
      "ne communiquez pas ce code et changez le mot de passe (npm run admin:seed).",
    ].join("\n"),
  };
}

export async function sendAdminEmail(
  message: AdminEmail,
  options: { apiKey: string | undefined; from: string; fetchImpl?: typeof fetch },
): Promise<boolean> {
  if (!options.apiKey) return false;
  try {
    const response = await (options.fetchImpl ?? fetch)("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: options.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
