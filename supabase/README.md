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

Optional older migrations (`user_bookings.sql`, `role_user_default.sql`) are superseded for booking auth; public booking no longer needs `user_id`.

In **Admin → Requests**, search by phone / email / name.  
In **Admin → Videos**, paste YouTube links → public site `/en/videos`.

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
