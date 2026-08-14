# Suborno physiotherapy and Autism Care

Vite + React TypeScript website combining hospital and autism school features.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build + SEO prerender
- `npm run seed:sql` — regenerate `supabase/seed.sql` from `src/data`
- `npm run preview` — preview production build

## Supabase

1. `.env` holds `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (local only; not committed)
2. In Supabase SQL Editor, run in order:
   - [`supabase/schema.sql`](supabase/schema.sql)
   - [`supabase/seed.sql`](supabase/seed.sql)
3. Full steps: [`supabase/README.md`](supabase/README.md)

Client: `src/lib/supabase.ts` · Services: `src/services/content.ts`

## Stack

- Vite + React 19 + TypeScript + React Router (EN/BN)
- react-i18next, react-helmet-async
- Supabase (Postgres + Auth + RLS)
