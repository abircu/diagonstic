-- Allow free-text doctor hub names (admin text input)

alter table public.doctors drop constraint if exists doctors_hub_check;
