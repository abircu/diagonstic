alter table public.site_settings
  add column if not exists marquee_text jsonb not null default '{"en":"","bn":""}';
