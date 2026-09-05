-- Homepage hero CMS: text on site_settings + slides via public.sliders

alter table public.site_settings
  add column if not exists hero_headline jsonb not null default '{"en":"","bn":""}',
  add column if not exists hero_sub jsonb not null default '{"en":"","bn":""}',
  add column if not exists hero_cta_primary jsonb not null default '{"en":"","bn":""}',
  add column if not exists hero_cta_secondary jsonb not null default '{"en":"","bn":""}';

-- Seed default EN/BN copy if empty
update public.site_settings
set
  hero_headline = case
    when coalesce(hero_headline->>'en', '') = '' and coalesce(hero_headline->>'bn', '') = ''
    then '{"en":"Care that grows with every patient and every special child","bn":"প্রতিটি রোগী ও প্রতিটি শিশুর সাথে বেড়ে ওঠা সেবা অটিজম কেয়ার"}'::jsonb
    else hero_headline
  end,
  hero_sub = case
    when coalesce(hero_sub->>'en', '') = '' and coalesce(hero_sub->>'bn', '') = ''
    then '{"en":"Hospital medicine and autism therapy under one coordinated campus.","bn":"এক সমন্বিত ক্যাম্পাসে হাসপাতাল চিকিৎসা ও অটিজম থেরাপি।"}'::jsonb
    else hero_sub
  end,
  hero_cta_primary = case
    when coalesce(hero_cta_primary->>'en', '') = '' and coalesce(hero_cta_primary->>'bn', '') = ''
    then '{"en":"Book Doctor Appointment","bn":"ডাক্তার অ্যাপয়েন্টমেন্ট বুক করুন"}'::jsonb
    else hero_cta_primary
  end,
  hero_cta_secondary = case
    when coalesce(hero_cta_secondary->>'en', '') = '' and coalesce(hero_cta_secondary->>'bn', '') = ''
    then '{"en":"Book Child Assessment","bn":"শিশু মূল্যায়ন বুক করুন"}'::jsonb
    else hero_cta_secondary
  end
where id = 1;

-- Allow larger hero photos in site-assets (5MB)
update storage.buckets
set file_size_limit = 5242880
where id = 'site-assets';
