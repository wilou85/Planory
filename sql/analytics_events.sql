-- Planory site analytics (self-hosted Hotjar/GA-style events)
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id            bigserial PRIMARY KEY,
  created_at    timestamptz NOT NULL DEFAULT now(),
  environment   text NOT NULL DEFAULT 'production',
  session_id    text NOT NULL,
  visitor_id    text,
  type          text NOT NULL,
  path          text,
  locale        text,
  device        text,
  payload       jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx
  ON public.analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_type_idx
  ON public.analytics_events (type);

CREATE INDEX IF NOT EXISTS analytics_events_session_id_idx
  ON public.analytics_events (session_id);

CREATE INDEX IF NOT EXISTS analytics_events_path_idx
  ON public.analytics_events (path);
