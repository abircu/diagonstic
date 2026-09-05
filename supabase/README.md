# Supabase setup (Suborno)

## 1. Env (already created locally)

`.env`:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

Do not commit `.env`. Use `.env.example` as template.

## 2. Create tables + RLS

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/grrguhxgjgrtprcqutpi/sql)
2. Paste **all** of [`schema.sql`](./schema.sql) → Run
3. Paste **all** of [`seed.sql`](./seed.sql) → Run

Regenerate seed anytime:
```bash
npm run seed:sql
```

## 3. Make yourself admin (after Auth user exists)

Authentication → Users → Add user (email/password).

Then SQL:
```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR_EMAIL@example.com');
```

If profile row missing:
```sql
insert into public.profiles (id, role, full_name)
select id, 'admin', email from auth.users where email = 'YOUR_EMAIL@example.com'
on conflict (id) do update set role = 'admin';
```

## 4. Admin login only (no public user accounts)

Booking forms are **public** — visitors submit **name + phone + email** (no login).

Admin opens this URL directly (not linked in the site header):

`/admin/login`

Create admin in Auth → Users → Add user, then:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR_EMAIL@example.com');
```

### Migration (existing DB)

Run once in SQL Editor:

1. [`migrations/public_booking_email.sql`](./migrations/public_booking_email.sql) — adds `email` columns + public insert / admin-only read
2. [`migrations/youtube_videos.sql`](./migrations/youtube_videos.sql) — YouTube video CMS table
3. [`migrations/youtube_videos_category.sql`](./migrations/youtube_videos_category.sql) — `promo` / `reference` category
4. [`migrations/services.sql`](./migrations/services.sql) — patient services CMS (Medical hub)
5. [`migrations/hero_cms.sql`](./migrations/hero_cms.sql) — homepage hero text + slides (Admin → Hero)
6. [`migrations/hubs_cms.sql`](./migrations/hubs_cms.sql) — homepage hubs section + images (Admin → Hubs)
7. [`migrations/about_page.sql`](./migrations/about_page.sql) — About page CMS (Admin → About)
8. [`migrations/admissions_page.sql`](./migrations/admissions_page.sql) — Admissions page CMS (Admin → Admissions)
9. [`migrations/doctors_hub_text.sql`](./migrations/doctors_hub_text.sql) — free-text doctor hub field
10. [`migrations/hero_marquee.sql`](./migrations/hero_marquee.sql) — homepage hero marquee text (EN/BN)
11. [`migrations/site_logo.sql`](./migrations/site_logo.sql) — navbar `logo_url` + `site-assets` storage bucket

Optional older migrations (`user_bookings.sql`, `role_user_default.sql`) are superseded for booking auth; public booking no longer needs `user_id`.

In **Admin → Requests**, search by phone / email / name.  
In **Admin → Hero**, edit headline/CTAs and upload carousel images.  
In **Admin → Hubs**, edit “Two hubs” title/cards and upload both images.  
In **Admin → About**, edit mission / vision / values / timeline.  
In **Admin → Admissions**, edit who / steps / documents / CTA.  
In **Admin → Packages**, manage health packages + includes list.  
In **Admin → Gallery**, upload gallery photos.  
In **Admin → Activities**, manage activity cards (+ optional images).  
In **Admin → Videos**, pick category (**Promo video** / **Reference video**) + paste YouTube or Cloudinary link → homepage shows two sections.  
In **Admin → Services**, manage Medical hub services (name, summary, optional link path).  
In **Admin → FAQs**, manage FAQ Q&A.

Also run [`migrations/activities.sql`](./migrations/activities.sql) for the Activities table + seed.

## 5. Verify from app

```ts
import { testSupabaseConnection } from "./services/content";
console.log(await testSupabaseConnection());
```

Client: [`src/lib/supabase.ts`](../src/lib/supabase.ts)

## API keys

Use either:

- **Publishable key** (`sb_publishable_...`) — API Keys tab (new), or
- **Legacy anon JWT** (`eyJ...`) — API Keys → Legacy

If the publishable key returns `Invalid API key`, copy the **legacy anon** key into `.env` as `VITE_SUPABASE_ANON_KEY` until your `supabase-js` version fully supports the new keys.

Keep **secret / service_role** keys off the frontend.
