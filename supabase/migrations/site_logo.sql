-- Fix: create logo column + site-assets bucket (run in Supabase SQL Editor)

alter table public.site_settings
  add column if not exists logo_url text;

-- Create public bucket for navbar logo uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];

-- Storage policies
drop policy if exists "site_assets_public_read" on storage.objects;
drop policy if exists "site_assets_admin_upload" on storage.objects;
drop policy if exists "site_assets_admin_update" on storage.objects;
drop policy if exists "site_assets_admin_delete" on storage.objects;
drop policy if exists "site_assets_auth_upload" on storage.objects;
drop policy if exists "site_assets_auth_update" on storage.objects;
drop policy if exists "site_assets_auth_delete" on storage.objects;

create policy "site_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'site-assets');

create policy "site_assets_auth_upload"
  on storage.objects for insert
  with check (bucket_id = 'site-assets' and auth.uid() is not null);

create policy "site_assets_auth_update"
  on storage.objects for update
  using (bucket_id = 'site-assets' and auth.uid() is not null)
  with check (bucket_id = 'site-assets' and auth.uid() is not null);

create policy "site_assets_auth_delete"
  on storage.objects for delete
  using (bucket_id = 'site-assets' and auth.uid() is not null);
