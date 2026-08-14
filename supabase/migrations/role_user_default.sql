-- Run once in Supabase SQL Editor
-- Default role = user (not viewer); keep existing admin rows

alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('admin', 'editor', 'user'));

alter table public.profiles alter column role set default 'user';

update public.profiles
set role = 'user'
where role = 'viewer';

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
