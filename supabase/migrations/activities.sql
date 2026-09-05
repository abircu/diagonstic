-- Activities CMS (cards with optional image)

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null default '{"en":"","bn":""}',
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists activities_sort_idx on public.activities (sort_order);

alter table public.activities enable row level security;

drop policy if exists "activities_public_read" on public.activities;
drop policy if exists "activities_admin_write" on public.activities;

create policy "activities_public_read" on public.activities
  for select using (published = true or public.is_admin());

create policy "activities_admin_write" on public.activities
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.activities (title, sort_order, published)
select * from (
  values
    ('{"en":"Dance & music","bn":"নাচ ও সঙ্গীত"}'::jsonb, 0, true),
    ('{"en":"Creative arts","bn":"সৃজনশীল শিল্প"}'::jsonb, 1, true),
    ('{"en":"Hydrotherapy / swimming","bn":"হাইড্রোথেরাপি / সাঁতার"}'::jsonb, 2, true),
    ('{"en":"Yoga & focus","bn":"যোগ ও ফোকাস"}'::jsonb, 3, true),
    ('{"en":"Indoor & outdoor play","bn":"ইনডোর ও আউটডোর খেলা"}'::jsonb, 4, true),
    ('{"en":"Community outings","bn":"কমিউনিটি আউটং"}'::jsonb, 5, true)
) as v(title, sort_order, published)
where not exists (select 1 from public.activities limit 1);
