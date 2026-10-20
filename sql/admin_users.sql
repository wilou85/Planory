-- Admin accounts for /admin analytics dashboard (JWT session cookie).
-- Emails are stored lowercased by the seed/login paths.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz,
  CONSTRAINT admin_users_email_unique UNIQUE (email)
);

-- Second factor: a single-use code e-mailed at each login (HMAC of the code, never the code).
CREATE TABLE IF NOT EXISTS public.admin_login_codes (
  user_id     uuid PRIMARY KEY REFERENCES public.admin_users (id) ON DELETE CASCADE,
  code_hash   text NOT NULL,
  created_at  timestamptz NOT NULL,
  expires_at  timestamptz NOT NULL,
  attempts    integer NOT NULL DEFAULT 0
);

-- Superseded by e-mailed codes.
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS totp_secret;
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS totp_enabled;
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS totp_last_counter;

-- Login audit trail shown in the dashboard "Sécurité" panel.
CREATE TABLE IF NOT EXISTS public.admin_login_events (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  user_id     uuid REFERENCES public.admin_users (id) ON DELETE CASCADE,
  email       text NOT NULL,
  success     boolean NOT NULL,
  reason      text,
  ip          text,
  user_agent  text
);

CREATE INDEX IF NOT EXISTS admin_login_events_created_at_idx
  ON public.admin_login_events (created_at DESC);

-- Speed up dashboard aggregations filtered by environment + time
CREATE INDEX IF NOT EXISTS analytics_events_environment_created_at_idx
  ON public.analytics_events (environment, created_at DESC);

CREATE INDEX IF NOT EXISTS analytics_events_environment_type_created_at_idx
  ON public.analytics_events (environment, type, created_at DESC);
