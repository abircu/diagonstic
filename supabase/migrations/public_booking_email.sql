-- Public booking (no user login): email contact + open insert; admin-only read

alter table public.appointment_requests
  add column if not exists email text;

alter table public.assessment_requests
  add column if not exists email text;

alter table public.ambulance_requests
  add column if not exists email text;

create index if not exists appointment_requests_phone_idx on public.appointment_requests (phone);
create index if not exists appointment_requests_email_idx on public.appointment_requests (email);
create index if not exists assessment_requests_phone_idx on public.assessment_requests (phone);
create index if not exists assessment_requests_email_idx on public.assessment_requests (email);
create index if not exists ambulance_requests_phone_idx on public.ambulance_requests (phone);
create index if not exists ambulance_requests_email_idx on public.ambulance_requests (email);

-- Appointments
drop policy if exists "appointments_public_insert" on public.appointment_requests;
drop policy if exists "appointments_admin_read" on public.appointment_requests;
drop policy if exists "appointments_user_insert" on public.appointment_requests;
drop policy if exists "appointments_user_or_admin_read" on public.appointment_requests;

create policy "appointments_public_insert" on public.appointment_requests
  for insert with check (true);
create policy "appointments_admin_read" on public.appointment_requests
  for select using (public.is_admin());

-- Assessments
drop policy if exists "assessments_public_insert" on public.assessment_requests;
drop policy if exists "assessments_admin_read" on public.assessment_requests;
drop policy if exists "assessments_user_insert" on public.assessment_requests;
drop policy if exists "assessments_user_or_admin_read" on public.assessment_requests;

create policy "assessments_public_insert" on public.assessment_requests
  for insert with check (true);
create policy "assessments_admin_read" on public.assessment_requests
  for select using (public.is_admin());

-- Ambulance
drop policy if exists "ambulance_public_insert" on public.ambulance_requests;
drop policy if exists "ambulance_admin_read" on public.ambulance_requests;
drop policy if exists "ambulance_user_insert" on public.ambulance_requests;
drop policy if exists "ambulance_user_or_admin_read" on public.ambulance_requests;

create policy "ambulance_public_insert" on public.ambulance_requests
  for insert with check (true);
create policy "ambulance_admin_read" on public.ambulance_requests
  for select using (public.is_admin());
