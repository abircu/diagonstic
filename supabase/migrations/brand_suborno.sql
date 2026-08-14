-- Update live site brand to Suborno
update public.site_settings
set
  brand = 'Suborno physiotherapy and Autism Care',
  brand_short = 'Suborno',
  tagline = '{"en":"Physiotherapy and autism care under one roof","bn":"এক ছাদের নিচে ফিজিওথেরাপি ও অটিজম কেয়ার"}'::jsonb
where id = 1;
