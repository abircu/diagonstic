-- Homepage hubs section CMS (title, copy, 2 card images)

alter table public.site_settings
  add column if not exists hubs_title jsonb not null default '{"en":"","bn":""}',
  add column if not exists hubs_sub jsonb not null default '{"en":"","bn":""}',
  add column if not exists hub_medical_title jsonb not null default '{"en":"","bn":""}',
  add column if not exists hub_medical_text jsonb not null default '{"en":"","bn":""}',
  add column if not exists hub_medical_image text,
  add column if not exists hub_medical_link text not null default '/medical',
  add column if not exists hub_autism_title jsonb not null default '{"en":"","bn":""}',
  add column if not exists hub_autism_text jsonb not null default '{"en":"","bn":""}',
  add column if not exists hub_autism_image text,
  add column if not exists hub_autism_link text not null default '/autism';

update public.site_settings
set
  hubs_title = case
    when coalesce(hubs_title->>'en', '') = '' and coalesce(hubs_title->>'bn', '') = ''
    then '{"en":"Two hubs. One care pathway.","bn":"দুই হাব। এক কেয়ার পথ।"}'::jsonb
    else hubs_title
  end,
  hubs_sub = case
    when coalesce(hubs_sub->>'en', '') = '' and coalesce(hubs_sub->>'bn', '') = ''
    then '{"en":"Choose medical care or autism school support — or move between both when your family needs it.","bn":"মেডিকেল সেবা বা অটিজম স্কুল সহায়তা বেছে নিন — প্রয়োজনে দুটোর মধ্যেই যাতায়াত করুন।"}'::jsonb
    else hubs_sub
  end,
  hub_medical_title = case
    when coalesce(hub_medical_title->>'en', '') = '' and coalesce(hub_medical_title->>'bn', '') = ''
    then '{"en":"Medical Center","bn":"মেডিকেল সেন্টার"}'::jsonb
    else hub_medical_title
  end,
  hub_medical_text = case
    when coalesce(hub_medical_text->>'en', '') = '' and coalesce(hub_medical_text->>'bn', '') = ''
    then '{"en":"Doctors, departments, diagnostics, packages, and emergency support.","bn":"ডাক্তার, বিভাগ, ডায়াগনস্টিক্স, প্যাকেজ ও জরুরি সহায়তা।"}'::jsonb
    else hub_medical_text
  end,
  hub_autism_title = case
    when coalesce(hub_autism_title->>'en', '') = '' and coalesce(hub_autism_title->>'bn', '') = ''
    then '{"en":"Autism School & Therapy","bn":"অটিজম স্কুল ও থেরাপি"}'::jsonb
    else hub_autism_title
  end,
  hub_autism_text = case
    when coalesce(hub_autism_text->>'en', '') = '' and coalesce(hub_autism_text->>'bn', '') = ''
    then '{"en":"ABA, speech, OT, special education, and family-guided admissions.","bn":"এবিএ, স্পিচ, ওটি, বিশেষ শিক্ষা ও পরিবার-নির্দেশিত ভর্তি।"}'::jsonb
    else hub_autism_text
  end
where id = 1;
