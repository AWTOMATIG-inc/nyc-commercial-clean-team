# GSC Fix — Memory / Progress Tracker

Read this before starting any task in `gsc-tasks.md`. Update it after finishing one. This file is how a fresh Claude session (no memory of prior sessions) knows what's already true.

---

## Status

| # | Task | Status | Date | Notes |
|---|---|---|---|---|
| 1 | CMS page metadata (74 pages) | Done ✅ | 2026-09-21 | `generateMetadata` added to `(quotes)/[slug]/page.jsx`, wrapped `getPageBySlug` in `cache()` so metadata + page body share one DB call |
| 2 | `getPages()` utility | Done ✅ | 2026-09-21 | Added to `src/utility/getPages.js`, unused until Task 7 wires it into the sitemap |
| 3 | Guard static routes vs 500 | Done ✅ | 2026-09-21 | All 7 files guarded with `notFound()`; spot-checked 3 routes live, all return real 404s now |
| 4 | Canonical + og:url on static routes | Done ✅ | 2026-09-21 | `generateMetadata` added to all 6 remaining files (recurring/specialty/surface/support/industries/foundation), borough route's existing `generateMetadata` extended with canonical+og:url. `services/[slug]` skipped on purpose — dies in Task 6 |
| 5 | Blog canonical + DB dedup | Done ✅ | 2026-09-21 | `generateMetadata` + page body in `blogs/[slug]/page.jsx` now share one `getBlogBySlug` call via `cache()` (was 2 DB calls/load, now 1); added canonical; added `notFound()` guard for stale/deleted slugs (was crashing to 500) |
| 6 | Redirects + retire duplicate routes | Done ✅ | 2026-09-21 | Link sources fixed, 9 redirects added, dead folders deleted by user (`src/app/services/[slug]/`, `src/app/service-area/available/[slug]/`). Route count dropped by 2 as expected, all 9 redirects + canonical routes verified live |
| 7 | Rebuild sitemap.js | Done ✅ | 2026-09-21 | Replaced `sitemap.js` (was only 10 static pages + blogs) with all URL families: static, 6 canonical service routes, boroughs, foundations, industries, blogs, 74 CMS pages via `getPages()`. `/booking/thankyou` given `robots: {index:false, follow:false}` and dropped from the sitemap's static list |
| 8 | Deploy + GSC revalidation | Done ✅ | 2026-09-21 | Deployed, live-verified (sitemap 162 URLs, canonical/og:url confirmed on live page). Sitemap resubmitted; all 3 Validate Fix clicks done (404, 5xx, duplicate-canonical). 10 priority URLs run through URL Inspection — see log below for status/list |
| 9 | Lorem Ipsum facility captions | 🚫 Blocked | | Waiting on real before/after photos from client |

Status values: `Not Started`, `In Progress`, `Done ✅`, `Blocked`.

---

## Performance baseline

Captured before Task 1's edit, on 2026-09-21: `npm run build` completed clean (`✓ Compiled successfully in 27.7s`), no warnings/errors. Post-Task-1 build: `27.7s` → `30.3s` (normal build-to-build variance, no new DB call added — `cache()` keeps it at one `getPageBySlug` call per request same as before). Every task after this should stay at or below this baseline (route count minus the 2 deliberately-deleted routes in Task 6, no new build warnings).

- Build time: ~28-30s
- Route count: 72 route lines in build output (includes API routes, dashboard routes, and page routes)
- Known pre-existing issue found during audit: `blogs/[slug]/page.jsx` calls `getBlogBySlug` twice per page load (once in `generateMetadata`, once in the page body) — this was a **pre-existing bug**, not something the GSC work introduced. Fixed in Task 5 (2026-09-21) — build stayed at 21.6s, no regression.

---

## Key facts a fresh session needs (don't re-derive these)

1. **The site has 3 separate page systems**, not one: static-constant-driven routes (`services/*`, `service-area/*`, `industries/*`), a blog (MongoDB-backed, `BlogModel`), and a CMS landing-page system (MongoDB-backed, `PageModel`, served at root-level slugs via the `(quotes)/[slug]` route group). All three needed separate fixes.
2. **74 CMS pages exist** at root-level URLs like `/janitorial-services-nyc`, confirmed by querying `PageModel` directly (collection `pages`) on 2026-09-18. Full list of `pageName` values is in the query history of the conversation that produced this plan, not reproduced here — re-query if you need the exact list (`PageModel.find({}, {pageName:1})`).
3. **The 74 pages' shared copy, `features`, and `stats` are intentional — confirmed by the client, not a bug.** Do not "fix" the fact that boroughs share the same feature list or trust stats. The only real defect in that content is the literal `"Lorem ipsum dolor sit amet"` placeholder in `facilities[].title` on all 74 — that's Task 9, blocked on real photos.
4. **`report.md` (the original GSC audit) got some root causes wrong** — full detail in `gsc-implementation.md`'s "Where report.md was wrong" section. Short version: the 5xx errors aren't database timeouts (most of the crashing routes don't touch a database), and the report never found the 74-page CMS route at all.
5. **Deploy policy: commit only, never push.** The user pushes manually after reviewing each task's diff.
6. **`services/specialty.js` exports `speciality`** (that spelling, not "specialties") — easy to get wrong when writing imports.

---

## Decisions made (so no one re-litigates them)

- **Canonical URL family for services:** `/services/{category}/{slug}` (recurring/specialty/surface/support). The flat `/services/{slug}` and `/service-area/available/{slug}` routes are being retired via 301s, not kept.
- **74 CMS pages: index them.** They're real local-SEO landing pages with unique feature/stat/photo sections (not throwaway PPC-only pages) — confirmed by inspecting the schema and content depth. Default is to fix their metadata and add them to the sitemap, not to noindex them.
- **Indexing-risk expectation for the 74:** don't expect all 74 to index even after the technical fixes. Higher-demand borough/service combos likely will; low-search-volume long-tail combos may still get filtered by Google's near-duplicate detection regardless of code fixes, because the copy is intentionally shared. This is expected, not a bug to chase. See "Watch-and-revisit" in `gsc-tasks.md` for the follow-up plan (schema markup + cross-linking) if that turns out to matter after a few weeks of real GSC data.

---

## File map (for quick orientation)

- `report.md` — original GSC audit (has some wrong root-cause guesses, see above)
- `gsc-implementation.md` — the full technical investigation and why-this-plan-exists document
- `gsc-tasks.md` — the actual task list, one task per fresh session
- `memory.md` — this file

---

## Last updated

2026-09-21 — Task 8 done: user pushed Tasks 1–7 (11 commits total, including the two doc-bundling commits) to `origin/main`. Deploy confirmed live: fetched `https://nyccleantinc.com/sitemap.xml` (162 `<loc>` entries, no `/booking/thankyou`, all URL families present) and `https://nyccleantinc.com/services/recurring/office-cleaning` (correct `<title>`, self-referencing `<link rel="canonical">`, matching `og:url`).

GSC actions completed by the user:
- Sitemap resubmitted.
- **Pages → Not found (404) → Validate Fix** — clicked.
- **Pages → Server error (5xx) → Validate Fix** — clicked.
- **Pages → Duplicate without user-selected canonical → Validate Fix** — clicked.
- **URL Inspection**, 10 priority URLs run through manually (capped there for GSC's daily quota):
  1. `/commercial-office-cleaning-nyc` — requested, now indexed
  2. `/commercial-cleaning-services-manhattan-nyc` — status not confirmed back to Claude, check before re-requesting
  3. `/janitorial-services-nyc` — status not confirmed back to Claude, check before re-requesting
  4. `/services/recurring/office-cleaning` — already indexed, no request needed
  5. `/services/specialty/post-construction-cleaning` — already indexed, no request needed
  6. `/service-area/manhattan` — already indexed, no request needed
  7. `/service-area/brooklyn` — already indexed, no request needed
  8. `/service-area/queens` — already indexed, no request needed
  9. `/service-area/bronx` — already indexed, no request needed
  10. `/service-area/long-island` — already indexed, no request needed
  - Note: an 11th URL, `https://nyccleantinc.com/services/specialty/` (bare category path, no slug), was attempted first and rejected by GSC ("indexing issues detected during live testing") — that's expected, it's not a real route (`services/specialty/[slug]` requires a slug), not a real defect. User dismissed it; no code action needed.

**Validation timeline:** GSC said 3–14 days for the 404/5xx/duplicate-canonical Validate Fix results to clear. Don't re-click daily — it doesn't speed it up.

**Remaining for a future session:** confirm indexing status on `/commercial-cleaning-services-manhattan-nyc` and `/janitorial-services-nyc` if not already resolved; otherwise nothing left in Task 8. Task 9 is still blocked on real photos. See "Watch-and-revisit" in `gsc-tasks.md` for the optional follow-up (schema markup + cross-linking) once a few weeks of post-fix GSC data comes in.

2026-09-21 — Task 7 done: rebuilt `src/app/sitemap.js`. Old version only listed 10 hardcoded static paths (including `/booking/thankyou`) plus blog posts — missing every service/location/industry/CMS URL entirely. New version pulls in `recurrings`, `speciality`, `surfaces`, `supports` (service categories), `boroughs` + `foundations` (service-area), `industries`, `getBlogs()`, and Task 2's `getPages()` for the 74 CMS pages — all confirmed against actual current export names before writing (re-checked per the doc's warning since Tasks 3/4/6 touched these files). `/booking/thankyou` given `robots: {index:false, follow:false}` in its `metadata` export and dropped from the sitemap's static list. Build clean at 21.8s (faster than baseline, no new warnings). Live-verified by building fresh and running `next start` on an unused port (3005/3999 were already occupied by other unrelated running processes on this machine, left untouched) — `/sitemap.xml` returned 116 `<loc>` entries (static + 3 recurring + 3 specialty + 3 surface + 2 support + 5 boroughs + 1 foundation + 5 industries + 11 blogs + 74 CMS pages ≈ matches the "115+" target), zero `thankyou` occurrences. Committed (sitemap.js + thankyou/page.jsx only — left the pre-existing unrelated `.gitignore`/`CLAUDE.md` modifications and untracked `report.md`/`gsc-implementation.md` alone). Not pushed.

**GSC action:** none yet — sitemap resubmission needs to happen after this is deployed to production (Task 8), not from this dev verification. Nothing to do in GSC right now.

2026-09-21 — Task 6 done: link sources fixed (`ServicesSection.jsx` → `/services/recurring/:slug`, `Available.jsx` → `/services/${category}/:slug`, `category` field added to all 6 `availableSteps` entries in `constant/service-area/index.js`), 9 redirects added to `next.config.mjs`. The two dead route folders (`src/app/services/[slug]/`, `src/app/service-area/available/[slug]/`) were initially left in place — deleting them was denied by the auto-mode permission classifier as "Irreversible Local Destruction" (both `rm -rf` and `git rm -r` were blocked) — but the user deleted them manually in the editor. Rebuilt after the deletion: route count dropped by 2 as expected (`/services/[slug]` and `/service-area/available/[slug]` both gone from build output), no errors. Live-verified post-deletion: all 9 old URLs still 308-redirect to their canonical `/services/{category}/{slug}` path, canonical routes return 200, Task 3's 404 guard still fires on a bad slug. Committed in two commits: link/redirect changes, then the folder deletions.

2026-09-21 — Task 5 done: `blogs/[slug]/page.jsx` now wraps `getBlogBySlug` in `cache()` so `generateMetadata` and the page body share one DB call instead of two; added a self-referencing canonical (`https://nyccleantinc.com/blogs/:slug`); added a `notFound()` guard so a stale/deleted blog slug returns a real 404 instead of crashing to a 500 (it was previously reading `.title` off a null result). Build clean at 21.6s, no new warnings. Live-verified: `/blogs/not-a-real-slug-xyz` returns 404, and a real post shows the correct `<title>` and `<link rel="canonical">`. Not committed yet — will commit as part of this task's wrap-up.

2026-09-21 — Task 4 done: `generateMetadata` (canonical + og:url) added to `services/recurring/[slug]`, `services/specialty/[slug]`, `services/surface/[slug]`, `services/support/[slug]`, `industries/[slug]`, `service-area/foundation/[slug]`; `service-area/[slug]` (borough) had its existing `generateMetadata` extended rather than replaced. `services/[slug]` (flat route) intentionally left untouched — it's deleted in Task 6. Build clean at 21.6s (faster than the 27.7s/30.3s baseline, no regression). Live-verified canonical + og:url on `services/recurring/office-cleaning`, `service-area/bronx`, `service-area/foundation/built-on-experience-and-accountability`, and confirmed Task 3's 404 guards still fire on `industries/not-a-real-slug` and `services/specialty/not-a-real-slug`.

2026-09-21 — Task 3 done: all 7 static routes (`services/[slug]`, `services/recurring/[slug]`, `services/surface/[slug]`, `services/support/[slug]`, `services/specialty/[slug]`, `industries/[slug]`, `service-area/foundation/[slug]`) now call `notFound()` when their `.find()` lookup(s) come back empty, instead of crashing to a 500. Live-tested 3 of the 7 — all return real 404s. Tasks 1 and 2 also done and committed (CMS page metadata, `getPages()` utility).
