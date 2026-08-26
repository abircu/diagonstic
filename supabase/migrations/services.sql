-- Patient / medical services CMS (admin-controlled)

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null default '{"en":"","bn":""}',
  summary jsonb not null default '{"en":"","bn":""}',
  link_path text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists services_sort_idx on public.services (sort_order);

alter table public.services enable row level security;

drop policy if exists "services_public_read" on public.services;
drop policy if exists "services_admin_write" on public.services;

create policy "services_public_read" on public.services
  for select using (published = true or public.is_admin());

create policy "services_admin_write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- Seed defaults (skip if slug already exists)
insert into public.services (slug, name, summary, link_path, sort_order, published)
values
  (
    'ambulance',
    '{"en":"Ambulance","bn":"অ্যাম্বুলেন্স"}'::jsonb,
    '{"en":"Rapid ambulance booking and emergency transport.","bn":"দ্রুত অ্যাম্বুলেন্স বুকিং ও জরুরি পরিবহন।"}'::jsonb,
    '/ambulance',
    0,
    true
  ),
  (
    'pharmacy',
    '{"en":"Pharmacy","bn":"ফার্মেসি"}'::jsonb,
    '{"en":"On-campus medicines for inpatients and OPD visitors.","bn":"ইনপেশেন্ট ও ওপিডি দর্শনার্থীদের জন্য ক্যাম্পাস ওষুধ।"}'::jsonb,
    null,
    1,
    true
  ),
  (
    'blood-bank',
    '{"en":"Blood Bank","bn":"ব্লাড ব্যাংক"}'::jsonb,
    '{"en":"Safe blood supply for surgery and emergencies.","bn":"অস্ত্রোপচার ও জরুরি অবস্থার জন্য নিরাপদ রক্ত সরবরাহ।"}'::jsonb,
    null,
    2,
    true
  ),
  (
    'guest-house',
    '{"en":"Guest House","bn":"গেস্ট হাউস"}'::jsonb,
    '{"en":"Affordable stay options for patient families.","bn":"রোগীর পরিবারের জন্য সাশ্রয়ী থাকার ব্যবস্থা।"}'::jsonb,
    null,
    3,
    true
  )
on conflict (slug) do nothing;
