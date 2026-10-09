# Sai Furniture — Supabase foundation

## Project

Repository: samyakrupwate12-ui/Saifurniture. Supabase project: koaflfdrucbawfplbmum.
The checked-in website is a Next.js 16.4.0 / React 19.3.0 / Tailwind 4 starter, not a completed furniture storefront. Keep local Antigravity design changes and merge this branch into them; do not overwrite them.

## Run

Copy `.env.example` to `.env.local`. Set NEXT_PUBLIC_SUPABASE_URL to https://koaflfdrucbawfplbmum.supabase.co and copy this project's publishable key from Supabase. Never use Second JLITCH credentials or a service-role key. Run `npm ci`, then `npm run dev`, and visit `/admin/login`.

On Vercel, set the same two environment variables for the intended Preview/Production environments and redeploy. No Vercel deployment or environment configuration is performed by this change.

## Implemented

- Cookie-based Supabase SSR connection and session refresh using Next.js proxy.
- Email/password login, logout, independent server authorization on dashboard reads, current active-admin lookup, and RLS-protected queries.
- Real dashboard counts; errors are not presented as zero counts.
- Anonymous, paginated `/api/catalogue?page=1` endpoint selecting public fields, published non-archived products only. No cache; ready for storefront integration.
- No public administrator registration. To add an admin, the project owner creates an Auth user in Supabase, then inserts the exact Auth user UUID into admin_users through the dashboard with an appropriate role and is_active=true. User accounts cannot promote themselves. Further differentiated admin permissions remain a later stage.

## Audit

Seven tables exist and have RLS. One active administrator is linked to an Auth user. Public catalogue SELECT policies exist. Customer enquiry and quotation policies require an active admin. No Storage buckets exist yet.

The foundation migration removes broad anonymous grants and TRUNCATE/REFERENCES/TRIGGER privileges from application roles. is_sai_admin can use SECURITY INVOKER because admin_users already has a self-only SELECT policy, with no call back to the helper. The RLS event-trigger function is not an application endpoint and its execute permissions are revoked from application roles.

The migration depends on the existing seven-table schema; it is not a complete baseline for an empty database. Capture a baseline before adding a clean-environment deployment pipeline.

## Remaining stages

Product/category CRUD, image bucket and storage policies, furniture storefront integration, secure public enquiries, quotations/PDFs, admin management and deployment are not implemented by this foundation. Push the existing local furniture design before integrating its catalogue UI. No production-ready claim is made for those remaining features.

Password login is subject to Supabase Auth rate limits. Configure CAPTCHA and leaked-password protection as supported by the project plan before public launch. Authenticated login/logout and refreshed-session behavior should be tested with the owner's real account; no password was requested or reset during development.

## Verification performed

Production build, TypeScript and ESLint pass. Production HTTP smoke checks: login 200, logged-out dashboard contains a streaming redirect to login, catalogue 200 with the existing empty dataset, invalid page 400. Admin responses use private/no-store. Database role tests confirm the active admin helper returns true, a non-admin sees no admin or enquiry rows and the helper returns false. Anonymous writes/customer reads and authenticated TRUNCATE grants are absent. Supabase security advisors now report only disabled leaked-password protection: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection . The least-privilege migration was applied to the Sai Furniture project and the versioned filename matches its remote migration history.
