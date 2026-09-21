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
| 5 | Blog canonical + DB dedup | Not Started | | |
| 6 | Redirects + retire duplicate routes | Not Started | | |
| 7 | Rebuild sitemap.js | Not Started | | |
| 8 | Deploy + GSC revalidation | Not Started | | |
| 9 | Lorem Ipsum facility captions | 🚫 Blocked | | Waiting on real before/after photos from client |

Status values: `Not Started`, `In Progress`, `Done ✅`, `Blocked`.

---

## Performance baseline

Captured before Task 1's edit, on 2026-09-21: `npm run build` completed clean (`✓ Compiled successfully in 27.7s`), no warnings/errors. Post-Task-1 build: `27.7s` → `30.3s` (normal build-to-build variance, no new DB call added — `cache()` keeps it at one `getPageBySlug` call per request same as before). Every task after this should stay at or below this baseline (route count minus the 2 deliberately-deleted routes in Task 6, no new build warnings).

- Build time: ~28-30s
- Route count: 72 route lines in build output (includes API routes, dashboard routes, and page routes)
- Known pre-existing issue found during audit: `blogs/[slug]/page.jsx` calls `getBlogBySlug` twice per page load (once in `generateMetadata`, once in the page body) — this is a **pre-existing bug**, not something the GSC work introduced. Task 5 fixes it.

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

2026-09-21 — Task 4 done: `generateMetadata` (canonical + og:url) added to `services/recurring/[slug]`, `services/specialty/[slug]`, `services/surface/[slug]`, `services/support/[slug]`, `industries/[slug]`, `service-area/foundation/[slug]`; `service-area/[slug]` (borough) had its existing `generateMetadata` extended rather than replaced. `services/[slug]` (flat route) intentionally left untouched — it's deleted in Task 6. Build clean at 21.6s (faster than the 27.7s/30.3s baseline, no regression). Live-verified canonical + og:url on `services/recurring/office-cleaning`, `service-area/bronx`, `service-area/foundation/built-on-experience-and-accountability`, and confirmed Task 3's 404 guards still fire on `industries/not-a-real-slug` and `services/specialty/not-a-real-slug`.

2026-09-21 — Task 3 done: all 7 static routes (`services/[slug]`, `services/recurring/[slug]`, `services/surface/[slug]`, `services/support/[slug]`, `services/specialty/[slug]`, `industries/[slug]`, `service-area/foundation/[slug]`) now call `notFound()` when their `.find()` lookup(s) come back empty, instead of crashing to a 500. Live-tested 3 of the 7 — all return real 404s. Tasks 1 and 2 also done and committed (CMS page metadata, `getPages()` utility).
