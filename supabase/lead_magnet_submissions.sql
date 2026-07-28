-- Lead magnets Planory — à exécuter dans le SQL Editor Supabase.
-- Table privée : accès uniquement via SUPABASE_SERVICE_ROLE_KEY (API Next.js).

create table if not exists public.lead_magnet_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  role text not null,
  sector text not null,
  magnet_slug text not null,
  locale text not null default 'fr',
  gdpr_consent boolean not null default true,
  email_status text not null default 'pending'
    check (email_status in ('pending', 'sent', 'failed', 'bypassed', 'skipped')),
  source text not null default 'lead-magnet-form',
  user_agent text,
  ip_hash text
);

create index if not exists lead_magnet_submissions_created_at_idx
  on public.lead_magnet_submissions (created_at desc);

create index if not exists lead_magnet_submissions_email_idx
  on public.lead_magnet_submissions (email);

create index if not exists lead_magnet_submissions_magnet_slug_idx
  on public.lead_magnet_submissions (magnet_slug);

alter table public.lead_magnet_submissions enable row level security;

-- Pas de policy publique : le service role bypass RLS.
-- (Les clés anon / authenticated ne voient rien.)

comment on table public.lead_magnet_submissions is
  'Leads marketing issus des formulaires lead magnet (Planory site).';
