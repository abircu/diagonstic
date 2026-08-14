# Supabase setup (Daig)

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

## 4. User bookings (required once)

Run [`migrations/user_bookings.sql`](./migrations/user_bookings.sql) in SQL Editor so booking tables get `user_id` + user RLS.

Also disable **Confirm email** so users can sign up and use the site immediately:

Authentication → Providers → Email → **Confirm email** = OFF

One admin only: set role in SQL (users stay `viewer` by default).

## 5. Admin panel

Open site **Login** button, or: **http://localhost:5173/en/login?admin=1&next=/admin**

Same login for users and admins. Admin role still set via SQL:

```sql
insert into public.profiles (id, role, full_name)
select id, 'admin', email from auth.users where email = 'YOUR_EMAIL@example.com'
on conflict (id) do update set role = 'admin';
```

After login: users → **My bookings**; admins also see **Admin** link.

## 6. Verify from app

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
