-- Suborno physiotherapy and Autism Care — Supabase schema
-- Run in: Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

-- Profiles (admin roles)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'editor', 'user')),
  full_name text,
  created_at timestamptz not null default now()
);

-- Site settings (single row)
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  brand text not null,
  brand_short text not null,
  tagline jsonb not null default '{"en":"","bn":""}',
  phone_main text,
  phone_main_display text,
  phone_medical text,
  phone_medical_display text,
  phone_admission text,
  phone_admission_display text,
  email_info text,
  email_admission text,
  address jsonb not null default '{"en":"","bn":""}',
  hours jsonb not null default '{"en":"","bn":""}',
  social jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  group_key text not null,
  summary jsonb not null,
  body jsonb not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  title jsonb not null,
  department_slug text references public.departments (slug) on delete set null,
  hub text not null check (hub in ('medical', 'autism', 'both')),
  bio jsonb not null,
  schedule jsonb not null,
  photo_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.therapies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  summary jsonb not null,
  what jsonb not null,
  how jsonb not null,
  benefits jsonb not null default '[]',
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  age jsonb not null,
  summary jsonb not null,
  offer jsonb not null,
  why jsonb not null,
  benefits jsonb not null default '[]',
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  summary jsonb not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  summary jsonb not null,
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name jsonb not null,
  summary jsonb not null,
  includes jsonb not null default '[]',
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.faqs (
  id text primary key,
  category text not null,
  question jsonb not null,
  answer jsonb not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.testimonials (
  id text primary key,
  quote jsonb not null,
  author jsonb not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.gallery_items (
  id text primary key,
  title jsonb not null,
  kind text not null default 'photo' check (kind in ('photo', 'video')),
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.sliders (
  id uuid primary key default gen_random_uuid(),
  title jsonb,
  subtitle jsonb,
  image_url text not null,
  link_url text,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.stats (
  id text primary key,
  value int not null,
  suffix text not null default '+',
  label jsonb not null,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  department_slug text,
  doctor_slug text,
  preferred_date date,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  parent_name text not null,
  phone text not null,
  email text,
  child_age text not null,
  concerns text not null,
  prior_diagnosis text,
  preferred_shift text,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.ambulance_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  contact_name text not null,
  phone text not null,
  email text,
  pickup_location text not null,
  notes text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'user', coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'editor')
  );
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.departments enable row level security;
alter table public.doctors enable row level security;
alter table public.therapies enable row level security;
alter table public.programs enable row level security;
alter table public.specialties enable row level security;
alter table public.diagnostics enable row level security;
alter table public.packages enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery_items enable row level security;
alter table public.sliders enable row level security;
alter table public.stats enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.assessment_requests enable row level security;
alter table public.ambulance_requests enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Public read published content
create policy "settings_public_read" on public.site_settings for select using (true);
create policy "departments_public_read" on public.departments for select using (published = true or public.is_admin());
create policy "doctors_public_read" on public.doctors for select using (published = true or public.is_admin());
create policy "therapies_public_read" on public.therapies for select using (published = true or public.is_admin());
create policy "programs_public_read" on public.programs for select using (published = true or public.is_admin());
create policy "specialties_public_read" on public.specialties for select using (published = true or public.is_admin());
create policy "diagnostics_public_read" on public.diagnostics for select using (published = true or public.is_admin());
create policy "packages_public_read" on public.packages for select using (published = true or public.is_admin());
create policy "faqs_public_read" on public.faqs for select using (published = true or public.is_admin());
create policy "testimonials_public_read" on public.testimonials for select using (published = true or public.is_admin());
create policy "gallery_public_read" on public.gallery_items for select using (published = true or public.is_admin());
create policy "sliders_public_read" on public.sliders for select using (published = true or public.is_admin());
create policy "stats_public_read" on public.stats for select using (published = true or public.is_admin());

-- Admin write content
create policy "settings_admin_write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "departments_admin_write" on public.departments for all using (public.is_admin()) with check (public.is_admin());
create policy "doctors_admin_write" on public.doctors for all using (public.is_admin()) with check (public.is_admin());
create policy "therapies_admin_write" on public.therapies for all using (public.is_admin()) with check (public.is_admin());
create policy "programs_admin_write" on public.programs for all using (public.is_admin()) with check (public.is_admin());
create policy "specialties_admin_write" on public.specialties for all using (public.is_admin()) with check (public.is_admin());
create policy "diagnostics_admin_write" on public.diagnostics for all using (public.is_admin()) with check (public.is_admin());
create policy "packages_admin_write" on public.packages for all using (public.is_admin()) with check (public.is_admin());
create policy "faqs_admin_write" on public.faqs for all using (public.is_admin()) with check (public.is_admin());
create policy "testimonials_admin_write" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "gallery_admin_write" on public.gallery_items for all using (public.is_admin()) with check (public.is_admin());
create policy "sliders_admin_write" on public.sliders for all using (public.is_admin()) with check (public.is_admin());
create policy "stats_admin_write" on public.stats for all using (public.is_admin()) with check (public.is_admin());

-- Public can submit requests (phone + email); only admin can read/update
create policy "appointments_public_insert" on public.appointment_requests
  for insert with check (true);
create policy "appointments_admin_read" on public.appointment_requests
  for select using (public.is_admin());
create policy "appointments_admin_update" on public.appointment_requests for update using (public.is_admin());

create policy "assessments_public_insert" on public.assessment_requests
  for insert with check (true);
create policy "assessments_admin_read" on public.assessment_requests
  for select using (public.is_admin());
create policy "assessments_admin_update" on public.assessment_requests for update using (public.is_admin());

create policy "ambulance_public_insert" on public.ambulance_requests
  for insert with check (true);
create policy "ambulance_admin_read" on public.ambulance_requests
  for select using (public.is_admin());
create policy "ambulance_admin_update" on public.ambulance_requests for update using (public.is_admin());
