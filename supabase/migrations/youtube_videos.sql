-- YouTube videos CMS (admin link upload → public embed)

create table if not exists public.youtube_videos (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{"en":"","bn":""}',
  youtube_url text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists youtube_videos_sort_idx on public.youtube_videos (sort_order);

alter table public.youtube_videos enable row level security;

drop policy if exists "youtube_public_read" on public.youtube_videos;
drop policy if exists "youtube_admin_write" on public.youtube_videos;

create policy "youtube_public_read" on public.youtube_videos
  for select using (published = true or public.is_admin());

create policy "youtube_admin_write" on public.youtube_videos
  for all using (public.is_admin()) with check (public.is_admin());
