import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOGIN_CODE_TTL_MS, findAdminById, listRecentLogins, readAdminSession } from "@/lib/admin-auth";
import { getResendApiKey, isEmailDevBypass } from "@/lib/email";

export async function GET() {
  const session = await readAdminSession(await cookies());
  const user = session ? await findAdminById(session.sub) : null;
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  return NextResponse.json({
    email: user.email,
    emailCodes: getResendApiKey() ? "resend" : isEmailDevBypass() ? "console" : "off",
    codeTtlMinutes: LOGIN_CODE_TTL_MS / 60_000,
    recentLogins: await listRecentLogins(),
  });
}
