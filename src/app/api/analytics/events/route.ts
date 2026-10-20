import { db, getAnalyticsEnvironment } from "@/lib/db";
import { parseAnalyticsEvent } from "@/lib/analytics/validate";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = parseAnalyticsEvent(body);

    if (!parsed.ok) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    const { event } = parsed;
    const environment = getAnalyticsEnvironment();

    await db.query(
      `
        INSERT INTO public.analytics_events (
          environment,
          session_id,
          visitor_id,
          type,
          path,
          locale,
          device,
          payload
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8::jsonb
        )
      `,
      [
        environment,
        event.sessionId,
        event.visitorId,
        event.type,
        event.path,
        event.locale,
        event.device,
        JSON.stringify(event.payload),
      ],
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Analytics error:", error);
    return Response.json({ error: "Analytics error" }, { status: 500 });
  }
}
