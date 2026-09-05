-- About page CMS (single-row)

create table if not exists public.about_page (
  id int primary key default 1 check (id = 1),
  title jsonb not null default '{"en":"","bn":""}',
  subtitle jsonb not null default '{"en":"","bn":""}',
  mission_title jsonb not null default '{"en":"","bn":""}',
  mission jsonb not null default '{"en":"","bn":""}',
  vision_title jsonb not null default '{"en":"","bn":""}',
  vision jsonb not null default '{"en":"","bn":""}',
  values_title jsonb not null default '{"en":"","bn":""}',
  values_body jsonb not null default '{"en":"","bn":""}',
  timeline_title jsonb not null default '{"en":"","bn":""}',
  timeline jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.about_page enable row level security;

drop policy if exists "about_public_read" on public.about_page;
drop policy if exists "about_admin_write" on public.about_page;

create policy "about_public_read" on public.about_page
  for select using (true);

create policy "about_admin_write" on public.about_page
  for all using (public.is_admin()) with check (public.is_admin());

insert into public.about_page (
  id, title, subtitle,
  mission_title, mission,
  vision_title, vision,
  values_title, values_body,
  timeline_title, timeline
) values (
  1,
  '{"en":"About Suborno","bn":"সুবর্ণ সম্পর্কে"}'::jsonb,
  '{"en":"A holistic campus for physiotherapy and autism care.","bn":"ফিজিওথেরাপি ও অটিজম কেয়ারের সামগ্রিক ক্যাম্পাস।"}'::jsonb,
  '{"en":"Mission","bn":"মিশন"}'::jsonb,
  '{"en":"Deliver evidence-based medical care and compassionate autism education so every family finds coordinated support.","bn":"প্রমাণভিত্তিক মেডিকেল সেবা ও সহানুভূতিশীল অটিজম শিক্ষা দিয়ে প্রতিটি পরিবার সমন্বিত সহায়তা পাক।"}'::jsonb,
  '{"en":"Vision","bn":"ভিশন"}'::jsonb,
  '{"en":"A trusted regional campus where clinical excellence and special education grow together.","bn":"একটি বিশ্বস্ত আঞ্চলিক ক্যাম্পাস যেখানে ক্লিনিকাল উৎকর্ষ ও বিশেষ শিক্ষা একসাথে বাড়ে।"}'::jsonb,
  '{"en":"Values","bn":"মূল্যবোধ"}'::jsonb,
  '{"en":"Dignity, safety, measurable progress, and family partnership.","bn":"মর্যাদা, নিরাপত্তা, পরিমাপযোগ্য অগ্রগতি ও পরিবার অংশীদারিত্ব।"}'::jsonb,
  '{"en":"Our journey","bn":"আমাদের যাত্রা"}'::jsonb,
  '[
    {"year":"2018","text":{"en":"Campus foundation & hospital services begin","bn":"ক্যাম্পাস ভিত্তি ও হাসপাতাল সেবা শুরু"}},
    {"year":"2020","text":{"en":"Autism therapy wing opens with ABA & speech","bn":"এবিএ ও স্পিচসহ অটিজম থেরাপি উইং উদ্বোধন"}},
    {"year":"2022","text":{"en":"Integrated IEP + medical referral pathways","bn":"সমন্বিত আইইপি + মেডিকেল রেফারেল পথ"}},
    {"year":"2024+","text":{"en":"Expanded diagnostics, packages, and outreach","bn":"সম্প্রসারিত ডায়াগনস্টিক্স, প্যাকেজ ও আউটরিচ"}}
  ]'::jsonb
)
on conflict (id) do nothing;
