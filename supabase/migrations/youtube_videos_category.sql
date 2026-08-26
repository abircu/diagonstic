-- Video category: promo | reference

alter table public.youtube_videos
  add column if not exists category text not null default 'promo';

alter table public.youtube_videos
  drop constraint if exists youtube_videos_category_check;

alter table public.youtube_videos
  add constraint youtube_videos_category_check
  check (category in ('promo', 'reference'));

create index if not exists youtube_videos_category_sort_idx
  on public.youtube_videos (category, sort_order);
