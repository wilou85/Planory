import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-auth";
import { fetchAnalyticsSummary } from "@/lib/admin-analytics/queries";

export async function GET(request: Request) {
  const session = await readAdminSession(await cookies());
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const url = new URL(request.url);
  try {
    const summary = await fetchAnalyticsSummary(url.searchParams.get("range"));
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[admin/analytics] summary query failed", error);
    return NextResponse.json({ error: "Base analytics indisponible" }, { status: 500 });
  }
}
