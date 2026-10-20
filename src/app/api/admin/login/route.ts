import { after, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  authenticateAdmin,
  buildLoginCodeEmail,
  createAdminSessionCookieOptions,
  findAdminByEmail,
  getAdminJwtSecret,
  isSecureCookieRequest,
  loginCodes,
  loginThrottleKeys,
  recordLoginEvent,
  sendAdminEmail,
  signAdminToken,
  touchLastLogin,
  verifyPassword,
} from "@/lib/admin-auth";
import { getContactEmailFrom, getResendApiKey, isEmailDevBypass } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function readString(body: unknown, key: string): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function tooManyAttempts(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Trop de tentatives. Réessayez plus tard." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const ipRate = checkRateLimit(loginThrottleKeys({ ip, email: "" }).ip, {
    limit: 10,
    windowMs: LOGIN_WINDOW_MS,
  });
  if (!ipRate.ok) return tooManyAttempts(ipRate.retryAfterSec);

  const secret = getAdminJwtSecret();
  if (!secret) {
    return NextResponse.json({ error: "Auth non configurée" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const email = readString(body, "email") ?? "";
  if (email.trim()) {
    const accountRate = checkRateLimit(loginThrottleKeys({ ip, email }).account, {
      limit: 10,
      windowMs: LOGIN_WINDOW_MS,
    });
    if (!accountRate.ok) return tooManyAttempts(accountRate.retryAfterSec);
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const outcome = await authenticateAdmin(
    { email, password: readString(body, "password") ?? "", code: readString(body, "code") },
    {
      findUser: findAdminByEmail,
      verifyPassword,
      issueCode: (userId) => loginCodes.issue(userId),
      verifyCode: (userId, code) => loginCodes.verify(userId, code),
      sendCode: async (user, code) => {
        if (isEmailDevBypass()) {
          console.info(`[admin/login] RESEND_API_KEY absente — code pour ${user.email} : ${code}`);
          return true;
        }
        return sendAdminEmail(buildLoginCodeEmail({ email: user.email, code, ip, userAgent, at: new Date() }), {
          apiKey: getResendApiKey(),
          from: getContactEmailFrom(),
        });
      },
    },
  );

  const audit = (success: boolean, userId: string | null, reason?: string) =>
    after(() =>
      recordLoginEvent({ userId, email, success, reason, ip, userAgent }).catch((error) =>
        console.error("[admin/login] audit failed", error),
      ),
    );

  if (outcome.status === "invalid") {
    if (email.trim()) audit(false, null, "password");
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }
  if (outcome.status === "code_sent" || outcome.status === "code_pending") {
    return NextResponse.json(
      {
        codeRequired: true,
        email: outcome.email,
        message:
          outcome.status === "code_sent"
            ? `Code envoyé à ${outcome.email}.`
            : "Un code vient déjà d'être envoyé : vérifiez vos e-mails, ou réessayez dans une minute.",
      },
      { status: 401 },
    );
  }
  if (outcome.status === "code_send_failed") {
    return NextResponse.json(
      { error: "Envoi du code par e-mail impossible. Vérifiez la configuration Resend du serveur." },
      { status: 503 },
    );
  }
  if (outcome.status === "code_invalid") {
    audit(false, null, "code");
    return NextResponse.json(
      { error: "Code invalide, expiré ou déjà utilisé", codeRequired: true },
      { status: 401 },
    );
  }

  const { user } = outcome;

  const token = await signAdminToken(
    { sub: user.id, email: user.email, role: user.role },
    { secret },
  );

  try {
    await touchLastLogin(user.id);
  } catch (error) {
    console.error("[admin/login] touchLastLogin failed", error);
  }

  audit(true, user.id);

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    token,
    createAdminSessionCookieOptions({
      secure: isSecureCookieRequest(request),
    }),
  );
  return response;
}
