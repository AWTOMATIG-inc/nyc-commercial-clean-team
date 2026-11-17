# Project memory

Site: nyccleantinc.com. Next.js App Router + MongoDB, self-hosted on a VPS (PM2 app `nyc-clean`, port 3005, nginx). A push to `main` auto-deploys to production.

## Site structure (don't re-derive)

- 3 page systems: static constant-driven routes (`services/*`, `service-area/*`, `industries/*`), a MongoDB blog (`BlogModel`), and 74 MongoDB CMS landing pages (`PageModel`) at root slugs like `/janitorial-services-nyc` via `src/app/(quotes)/[slug]/page.jsx`.
- The 74 CMS pages share copy, features and stats on purpose (client confirmed). Don't "fix" that. Index them all; expect some long-tail ones to stay unindexed.
- Canonical service URLs: `/services/{category}/{slug}` (recurring, specialty, surface, support). Old flat routes 301 to these.
- `services/specialty.js` exports `speciality` (that spelling).

## GSC indexing fix (Sep 2026): done

- All CMS pages, static routes and blogs have metadata, canonical and og:url. Bad slugs return 404, not 500.
- `sitemap.js` covers every URL family (~162 URLs). `/booking/thankyou` is noindex.
- Duplicate routes retired with redirects in `next.config.mjs`.
- Old WordPress URLs that GSC still listed as 404 now redirect (Nov 2026). Junk probe URLs (`$`, `&`, `*`, wp-admin) stay 404 on purpose.
- Optional later: `Service`/`LocalBusiness` schema with `areaServed` and borough cross-links, only if GSC data shows many of the 74 pages unindexed.

## SEO work (Oct–Nov 2026)

Done: merged competing office/day porter/window pages, www → non-www, footer service-area links, cross-links on the 74 pages, 5 related posts per blog, shorter titles, one H1 per page, HSTS, `public/llms.txt`, LocalBusiness on homepage, NAP in footer, homepage and Blogs page slimmed (715 KB → 117 KB, 230 KB → 59 KB), more text on Contact and About.

Open (code): FAQ/Service schema, LocalBusiness on contact page, better titles and links on industry pages (restaurant, retail).

Open (not code): content writing, Google reviews, Google Business Profile, directory listings, backlinks (Authority Score 9).

Left alone on purpose: low text-to-HTML ratio warnings, low word count on privacy, terms and about.

## Blocked

- "Lorem ipsum" before/after facility captions on all 74 CMS pages. Waiting on real photos from the client.

## Chatbot (Jul 2026): done

- Floating widget on every page. LLM is Groq (`openai/gpt-oss-120b`, `GROQ_API_KEY`), knowledge hardcoded in the system prompt, history in sessionStorage only.
- Collects quotes and posts them to `/api/quote`. Booking requests link to `/booking`.
- `facilityType` must match `industryOptions` in `src/constant/booking/booking.js`.
- `/api/chat` has a rate limiter.

## GTM: done

`src/lib/gtm.js` plus the snippet in `src/app/layout.js`, using `NEXT_PUBLIC_GTM_ID`.

## Next project: Phase 1 work order (signed 12 Oct 2026)

Extend this site into a full customer-to-payment flow over 12 weeks: customer accounts with companies and properties, service intake, admin quotes with revisions, one-off Stripe payment, QuickBooks sync, scheduling, emails at each step. No saved cards, no subscriptions. The PDF at the repo root is the authoritative version.

## Rules

- Commit only, never push. The user pushes after review.
- Don't regress performance. Build was ~22–30 s.
- Never start the app with `.env` as-is. It holds production credentials.
