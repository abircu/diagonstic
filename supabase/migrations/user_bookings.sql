-- Run in Supabase SQL Editor (existing projects)
-- Adds user ownership for booking requests + user read policies

alter table public.appointment_requests
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.assessment_requests
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.ambulance_requests
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists appointment_requests_user_id_idx on public.appointment_requests (user_id);
create index if not exists assessment_requests_user_id_idx on public.assessment_requests (user_id);
create index if not exists ambulance_requests_user_id_idx on public.ambulance_requests (user_id);

-- Replace open insert policies with authenticated owner inserts
drop policy if exists "appointments_public_insert" on public.appointment_requests;
drop policy if exists "appointments_admin_read" on public.appointment_requests;
drop policy if exists "appointments_user_insert" on public.appointment_requests;
drop policy if exists "appointments_user_or_admin_read" on public.appointment_requests;

create policy "appointments_user_insert" on public.appointment_requests
  for insert with check (auth.uid() is not null and user_id = auth.uid());
create policy "appointments_user_or_admin_read" on public.appointment_requests
  for select using (public.is_admin() or user_id = auth.uid());

drop policy if exists "assessments_public_insert" on public.assessment_requests;
drop policy if exists "assessments_admin_read" on public.assessment_requests;
drop policy if exists "assessments_user_insert" on public.assessment_requests;
drop policy if exists "assessments_user_or_admin_read" on public.assessment_requests;

create policy "assessments_user_insert" on public.assessment_requests
  for insert with check (auth.uid() is not null and user_id = auth.uid());
create policy "assessments_user_or_admin_read" on public.assessment_requests
  for select using (public.is_admin() or user_id = auth.uid());

drop policy if exists "ambulance_public_insert" on public.ambulance_requests;
drop policy if exists "ambulance_admin_read" on public.ambulance_requests;
drop policy if exists "ambulance_user_insert" on public.ambulance_requests;
drop policy if exists "ambulance_user_or_admin_read" on public.ambulance_requests;

create policy "ambulance_user_insert" on public.ambulance_requests
  for insert with check (auth.uid() is not null and user_id = auth.uid());
create policy "ambulance_user_or_admin_read" on public.ambulance_requests
  for select using (public.is_admin() or user_id = auth.uid());
