# Backlinks pages review: 17 Nov 2026

## What we got

1. `nyccleantinc.com-backlinks_pages.csv`: Semrush "Backlinks → Pages" export.
   - 59 old nyccleantinc.com URLs. Status codes in the export: 41 × 404, 16 × 500, 2 × 403.
   - Backlinks = 0 and referring domains = 0 on every row. Nothing external links to these pages, so there is no link equity to recover.
   - The 16 "500" rows (`/services/*`, 2 × `/blogs/*`) were last seen 2026-06-19.
2. `nyccleantinc.com-Coverage-Drilldown-2026-11-17.zip`: Google Search Console export, Indexing → Pages → "Not found (404)".
   - 18 URLs that Google itself lists as 404.
   - Affected pages fell from 31 (21 Aug) to 19 (13 Nov) and have been flat since.

## What we checked

- Live status of all 16 "500" URLs: every one returns a clean **404** now. They were old errors in a stale Semrush snapshot, not a live problem.
- `www.nyccleantinc.com` already 308-redirects to non-www, so the www rows are covered.
- Redirect targets (`/commercial-cleaning-brooklyn`, `/commercial-cleaning-queens`, `/commercial-cleaning-services-manhattan-nyc`, `/commercial-deep-cleaning-nyc`, `/blogs`) all return 200.
- Redirects tested on a local dev server: `/blogs/2`, `/blogs/3`, `/disclaimer`, `/cleaning-services-new-me-`, `/gallery/` land on the right place. URLs with a trailing slash take two hops (slash stripped, then our rule).

## What we fixed

Commit `d5def33` (pushed to `main`): 14 permanent (308) redirects in `next.config.mjs`.

| Old URL | Goes to |
|---|---|
| `/blogs/:page` (digits) | `/blogs` |
| `/brooklyn-cleaning-service-nyc` | `/commercial-cleaning-brooklyn` |
| `/queens-cleaning-service-nyc` | `/commercial-cleaning-queens` |
| `/office-cleaning-services-manhattan-nyc` | `/commercial-cleaning-services-manhattan-nyc` |
| `/cleaning-and-disinfecting-commercial-offices-nyc` | `/commercial-deep-cleaning-nyc` |
| `/cleaning-vs-disinfection-vs-sterilization-in-nyc` | `/commercial-deep-cleaning-nyc` |
| `/the-top-10-benefits-of-hiring-a-professional-commercial-cleaning-service` | `/blogs` |
| `/the-ultimate-guide-to-choosing-the-right-commercial-cleaning-company` | `/blogs` |
| `/category/dryer-vent-cleaning` | `/blogs` |
| `/category/cleaning-vs-disinfection-vs-sterilization` | `/blogs` |
| `/cleaning-services-new-me-in-new-york` | `/` |
| `/cleaning-services-new-me-` | `/` |
| `/gallery` | `/` |
| `/disclaimer` | `/` |

## Left alone on purpose

- `/$`, `/&`, `/*`, `/wp-admin/admin-ajax.php`: junk crawl artifacts, 404 is the correct answer.
- The other ~40 URLs in the Semrush CSV that GSC does not list: no backlinks, not in Google's 404 report, so no redirect needed. Add more rules only if they show up in GSC later.

## Open

1. **Confirm the deploy succeeded.** Not verified yet. Risk: the production build could fail on the same MongoDB `bad auth` error that broke the local build (`/blogs` prerender).
2. **Local `.env` has a bad MongoDB login.** `npx next build` fails locally with `bad auth : authentication failed`. Likely a rotated password (see the open API incident). Update `MONGODB_URI` in the local `.env`.
3. **Redirects not fully tested end to end.** The dev server died partway, so the Brooklyn, Queens, Manhattan, deep-cleaning, blog-post and category rules were not followed through to their final page. `next build` has not run past the compile step because of item 2.
4. **After deploy, test on the live site:** `/gallery/`, `/brooklyn-cleaning-service-nyc/`, `/blogs/2` should each land on a real page.
5. **Then click "Validate fix"** in GSC, Indexing → Pages → "Not found (404)". Takes days to weeks. The 4 junk URLs will keep it from showing a full pass.
6. **Re-check GSC in 2–3 weeks** for new 404s.
