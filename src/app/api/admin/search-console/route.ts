import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readAdminSession } from "@/lib/admin-auth";
import { fetchSearchConsoleSummary } from "@/lib/search-console";

export async function GET(request: Request) {
  const session = await readAdminSession(await cookies());
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const url = new URL(request.url);
  try {
    return NextResponse.json(await fetchSearchConsoleSummary(url.searchParams.get("range")));
  } catch (error) {
    console.error("[admin/search-console] query failed", error);
    const message = error instanceof Error ? error.message : "Search Console indisponible";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
