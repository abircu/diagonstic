-- Admissions page CMS (single-row)

create table if not exists public.admissions_page (
  id int primary key default 1 check (id = 1),
  title jsonb not null default '{"en":"","bn":""}',
  subtitle jsonb not null default '{"en":"","bn":""}',
  who_title jsonb not null default '{"en":"","bn":""}',
  who_body jsonb not null default '{"en":"","bn":""}',
  steps_title jsonb not null default '{"en":"","bn":""}',
  steps jsonb not null default '[]'::jsonb,
  docs_title jsonb not null default '{"en":"","bn":""}',
  docs jsonb not null default '[]'::jsonb,
  cta_label jsonb not null default '{"en":"","bn":""}',
  cta_link text not null default '/assessment',
  updated_at timestamptz not null default now()
);

alter table public.admissions_page enable row level security;

drop policy if exists "admissions_public_read" on public.admissions_page;
drop policy if exists "admissions_admin_write" on public.admissions_page;

create policy "admissions_public_read" on public.admissions_page
  for select using (true);

create policy "admissions_admin_write" on public.admissions_page
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.admissions_page (
  id, title, subtitle, who_title, who_body, steps_title, steps, docs_title, docs, cta_label, cta_link
) values (
  1,
  '{"en":"Admissions","bn":"ভর্তি"}'::jsonb,
  '{"en":"From inquiry to personalized placement.","bn":"জিজ্ঞাসা থেকে ব্যক্তিগত প্লেসমেন্ট পর্যন্ত।"}'::jsonb,
  '{"en":"Who can apply","bn":"কে আবেদন করতে পারে"}'::jsonb,
  '{"en":"Children with autism or developmental delays. Admission is based on assessment needs.","bn":"অটিজম বা বিকাশজনিত বিলম্বযুক্ত শিশুরা। ভর্তি মূল্যায়নের চাহিদা অনুসারে।"}'::jsonb,
  '{"en":"Enrollment steps","bn":"ভর্তির ধাপ"}'::jsonb,
  '[
    {"en":"Inquiry & campus visit","bn":"জিজ্ঞাসা ও ক্যাম্পাস ভিজিট"},
    {"en":"Clinical assessment","bn":"ক্লিনিকাল মূল্যায়ন"},
    {"en":"Recommendations shared","bn":"সুপারিশ ভাগ"},
    {"en":"IEP & placement plan","bn":"আইইপি ও প্লেসমেন্ট পরিকল্পনা"},
    {"en":"Enrollment & first sessions","bn":"ভর্তি ও প্রথম সেশন"}
  ]'::jsonb,
  '{"en":"Documents checklist","bn":"কাগজপত্রের তালিকা"}'::jsonb,
  '[
    {"en":"Child photos","bn":"শিশুর ছবি"},
    {"en":"Birth certificate","bn":"জন্ম সনদ"},
    {"en":"Prior medical / diagnostic reports","bn":"পূর্ববর্তী মেডিকেল / ডায়াগনস্টিক রিপোর্ট"},
    {"en":"Parent NID copies","bn":"অভিভাবকের এনআইডি কপি"}
  ]'::jsonb,
  '{"en":"Book an assessment","bn":"মূল্যায়ন বুক করুন"}'::jsonb,
  '/assessment'
)
on conflict (id) do nothing;
