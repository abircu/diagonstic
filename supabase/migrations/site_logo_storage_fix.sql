-- Allow any logged-in user to upload to site-assets (fixes logo upload RLS)

drop policy if exists "site_assets_public_read" on storage.objects;
drop policy if exists "site_assets_admin_upload" on storage.objects;
drop policy if exists "site_assets_admin_update" on storage.objects;
drop policy if exists "site_assets_admin_delete" on storage.objects;

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
