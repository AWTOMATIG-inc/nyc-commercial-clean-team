# GSC Fix — Task Breakdown

**If you're a fresh Claude session starting a task:** read `CLAUDE.md` → `gsc-implementation.md` (why/what) → `memory.md` (current state — which tasks are already done) → then only the one task section below you were asked to do. Do not do other tasks "while you're at it."

**If you're the user opening a new session:** tell it which task number to run, e.g. "do Task 3 in gsc-tasks.md."

---

## Non-negotiables (every task, no exceptions)

1. **Performance must stay the same or improve. Never regress it.** Concretely: don't add a database call that wasn't already happening on that page render (see Task 1's `cache()` note — this bit us on the first task). Run `npm run build` after every task and confirm it succeeds with no new warnings before calling the task done.
2. **Commit only. Do not push.** The user pushes manually after reviewing. Don't run `git push` under any circumstance in these tasks.
3. **Don't touch copy, `features`, or `stats` on the 74 CMS pages.** The client wants that content identical across boroughs — confirmed, not a bug. The only content-level exception is the "Lorem ipsum" facility caption, and that's blocked (Task 9) until real photos exist.
4. **Read the actual current file before editing it.** Code snippets in this doc reflect the state when this file was written. If an earlier task already changed a file, its current content wins — don't blindly paste a snippet over changed code.
5. **When a task is done, report using the ADHD-mode shape:** lead with what now works, then a numbered "what to test" list, then — critically — **tell the user explicitly whether they need to do anything in Google Search Console**, and what, or say plainly "nothing to do in GSC yet." Don't bury that in a recap.

---

## Task list

| # | Task | Depends on | Est. time |
|---|---|---|---|
| 1 | CMS page metadata (74 pages, one file) | — | 30–45 min |
| 2 | `getPages()` list-all utility | — | 15 min |
| 3 | Guard static routes against crash-to-500 | — | 1–1.5 hr |
| 4 | Canonical + og:url on static routes | Task 3 (do after, so you're not editing a file twice) | 1.5–2 hr |
| 5 | Blog canonical + fix duplicate DB call | — | 30 min |
| 6 | Redirects + retire duplicate routes | — | 1.5–2 hr |
| 7 | Rebuild sitemap.js | Task 2 | 1 hr |
| 8 | Deploy + GSC revalidation | Tasks 1–7 pushed live | 30 min + waiting |
| 9 | 🚫 BLOCKED — replace Lorem Ipsum facility captions | Real before/after photos (not ready yet) | — |

Do them in order unless you have a reason not to — 6 and 7 both touch routing/URLs, doing them out of order risks confusing yourself about which URLs are currently live.

---

## Task 1 — CMS page metadata (74 pages)

**Impact:** single highest-leverage fix in the whole plan. One file, fixes metadata for 74 of ~130 known URLs.

**File:** `src/app/(quotes)/[slug]/page.jsx`

**Context:** this route (a Next.js route group — the `(quotes)` folder doesn't appear in the URL) serves 74 database-backed pages like `/janitorial-services-nyc`, `/day-porter-services-brooklyn`, etc. It currently has zero `generateMetadata`, so every one of the 74 ships the root layout's fallback title (`NYC Clean Commercial Team Admin & Management`) and homepage `og:url`.

**Steps:**

1. Capture a performance baseline before touching anything: run `npm run build`, note the build time and that it completes clean. Write it into `memory.md`'s "Performance baseline" section (replace the "not yet captured" placeholder).
2. Read the current `src/app/(quotes)/[slug]/page.jsx` in full.
3. Add a `generateMetadata` export. **Important — avoid a duplicate DB call:** the page body already calls `getPageBySlug(slug)`. If `generateMetadata` calls it again independently, Next.js does NOT automatically dedupe a raw async function the way it dedupes `fetch()` — you'd be doubling the DB round-trip on every page load, a real performance regression. Wrap the fetch with React's `cache()` so both call sites share one result per request:

```jsx
import { cache } from "react";
import { getPageBySlug } from "@/utility/getPages";
// ...existing imports stay

const getCachedPage = cache(async (slug) => getPageBySlug(slug));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pageDetail = await getCachedPage(slug);
  if (!pageDetail) return {};
  const url = `https://nyccleantinc.com/${slug}`;
  return {
    title: `${pageDetail.title} | NYC Commercial Clean Team`,
    description: pageDetail.shortDescription,
    alternates: { canonical: url },
    openGraph: { url, title: pageDetail.title, description: pageDetail.shortDescription },
  };
}

export default async function Quotes({ params }) {
  const { slug } = await params;
  const feedbacks = await getFeedback();
  const pageDetail = await getCachedPage(slug);   // <-- was getPageBySlug(slug), now uses the cached wrapper
  if (!pageDetail) {
    notFound();
  }
  // ...rest of the function is unchanged
```

4. Run `npm run build`. Confirm it completes with no new errors.

**Performance check:** with `cache()` in place, each page load should do exactly one `getPageBySlug` DB call, same as before this change — verify by checking the diff doesn't introduce a second uncached call anywhere.

**Done when:** view-source on `https://nyccleantinc.com/janitorial-services-nyc` (or dev equivalent) shows a `<title>` matching that page's real title, not the admin boilerplate, and a `<link rel="canonical" href="https://nyccleantinc.com/janitorial-services-nyc">`.

**GSC action after this task:** none yet — these pages aren't in the sitemap until Task 7. Metadata alone doesn't trigger a re-crawl.

---

## Task 2 — `getPages()` list-all utility

**File:** `src/utility/getPages.js`

**Context:** only `getPageById` and `getPageBySlug` exist. Task 7's sitemap rebuild needs a function that lists every CMS page.

**Steps:**

1. Read the current file (it's short — three functions, all following the same `try/await db_connect()/return JSON.parse(JSON.stringify(...))` shape).
2. Add, matching the existing style exactly:

```js
export const getPages = async () => {
  try {
    await db_connect();
    const pages = await PageModel.find({}, { pageName: 1, updatedAt: 1 }).lean();
    return JSON.parse(JSON.stringify(pages));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
```

3. Run `npm run build`.

**Performance check:** this function isn't called anywhere yet (Task 7 wires it up), so no runtime impact from this task alone.

**Done when:** the function exists and the build passes. Nothing user-visible changes yet.

**GSC action after this task:** none.

---

## Task 3 — Guard static routes against crash-to-500

**Context:** 7 routes read from static JS arrays in `src/constant/`, `array.find(...)`, then immediately read a property off the result with **no check that it exists.** Any slug that doesn't match crashes with an unhandled `TypeError`, which Next.js renders as a 500 — this is the real cause of GSC's "Server error (5xx)" bucket for these routes, not database load (they don't touch a database at all).

**Files (all get the same one-line fix):**

- [ ] `src/app/services/[slug]/page.jsx`
- [ ] `src/app/services/recurring/[slug]/page.jsx`
- [ ] `src/app/services/surface/[slug]/page.jsx`
- [ ] `src/app/services/support/[slug]/page.jsx`
- [ ] `src/app/services/specialty/[slug]/page.jsx`
- [ ] `src/app/industries/[slug]/page.jsx`
- [ ] `src/app/service-area/foundation/[slug]/page.jsx`

**Steps (repeat per file):**

1. Read the current file.
2. Add `import { notFound } from "next/navigation";` to the top.
3. Right after the `.find(...)` lookups (before the `return (`), add a guard checking every variable that was looked up. Example for `services/[slug]/page.jsx`:

```jsx
const service = services.find(service => service.slug === slug);
const detail = details.find(service => service.slug === slug);
if (!service || !detail) notFound();   // <-- add
```

For the other 6 files, guard whichever variables that file looks up (each file looks up 1–2: e.g. `services/recurring/[slug]/page.jsx` guards `recurring` and `detail`; `industries/[slug]/page.jsx` guards `item` and `detail`; `service-area/foundation/[slug]/page.jsx` guards `foundation` only — it doesn't look up a second `detail`).

4. After all 7 files: run `npm run build`.

**Performance check:** zero runtime cost — this is a conditional check on data already in memory, not a new fetch or computation.

**Done when:** visiting a nonexistent slug on any of these 7 routes (e.g. `/services/not-a-real-slug`, `/industries/not-a-real-slug`) returns a real Next.js 404 page instead of a crash/500 page. Spot-check at least 3 of the 7.

**GSC action after this task:** yes, but not yet — batch it with Task 8's GSC validation step once this is deployed. No action needed right after this task alone.

---

## Task 4 — Canonical + og:url on static routes

**Do this after Task 3** (same files, avoid editing each one twice in unrelated sessions).

**Files:**

- [ ] `src/app/services/recurring/[slug]/page.jsx` — canonical: `/services/recurring/:slug`
- [ ] `src/app/services/specialty/[slug]/page.jsx` — canonical: `/services/specialty/:slug`
- [ ] `src/app/services/surface/[slug]/page.jsx` — canonical: `/services/surface/:slug`
- [ ] `src/app/services/support/[slug]/page.jsx` — canonical: `/services/support/:slug`
- [ ] `src/app/industries/[slug]/page.jsx` — canonical: `/industries/:slug`
- [ ] `src/app/service-area/[slug]/page.jsx` (boroughs) — already has `generateMetadata`, just extend its return object
- [ ] `src/app/service-area/foundation/[slug]/page.jsx` — canonical: `/service-area/foundation/:slug`

**Do NOT touch** `src/app/services/[slug]/page.jsx` (flat route) — it gets deleted in Task 6, don't add metadata to a file you're about to remove.

**Steps (per file, except the borough one):**

1. Read the current file — it now has the Task 3 `notFound()` guard, build on top of that.
2. Add `generateMetadata`, reusing the same lookup the page body already does:

```jsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const detail = details.find(d => d.slug === slug);   // adjust variable/array name to match this file
  if (!detail) return {};
  const url = `https://nyccleantinc.com/services/recurring/${slug}`;   // adjust path per file, see table above
  return {
    title: `${detail.heading} | NYC Commercial Clean Team`,
    description: detail.desc,
    alternates: { canonical: url },
    openGraph: { url },
  };
}
```

No `cache()` needed here — these read static in-memory arrays, not a database, so calling `.find()` twice (once in `generateMetadata`, once in the page body) costs nothing measurable. Task 1's `cache()` concern was specifically about a DB round-trip; don't over-apply it where there's no DB involved.

3. For `src/app/service-area/[slug]/page.jsx`: don't add a new function — extend the existing `generateMetadata`'s return object with `alternates: { canonical: url }` and `openGraph: { url }`, building `url` from `https://nyccleantinc.com/service-area/${slug}`.
4. After all 7: run `npm run build`.

**Done when:** view-source on a live page from each of the 7 routes shows a correct self-referencing canonical and an `og:url` matching that page, not the homepage.

**GSC action after this task:** none yet — batch with Task 8.

---

## Task 5 — Blog canonical + fix duplicate DB call

**File:** `src/app/blogs/[slug]/page.jsx`

**Context:** this file has a **pre-existing performance bug**, not something introduced by this plan — `generateMetadata` calls `getBlogBySlug(slug)`, and the page body calls `getBlogBySlug(slug)` again independently. That's two DB round-trips per blog page load where one would do. Fix it in the same pass as adding canonical, since you're touching the file anyway — this is a case where "don't regress performance" becomes "actually improve it."

**Steps:**

1. Read the current file.
2. Wrap the fetch with `cache()` and add the canonical, plus a guard for the null case (a stale/deleted blog slug currently crashes this page to a 500 — same root-cause pattern as Task 3, fix it here too since it's the same file):

```jsx
import { cache } from "react";
import { notFound } from "next/navigation";
// ...existing imports stay

const getCachedBlog = cache(async (slug) => getBlogBySlug(slug));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getCachedBlog(slug);
  if (!blog) return {};
  return {
    title: `Blogs - ${blog.title} |`,
    description: blog.shortDescription || blog.metaDescription,
    alternates: { canonical: `https://nyccleantinc.com/blogs/${slug}` },
  };
}
export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const blog = await getCachedBlog(slug);
  if (!blog) notFound();
  // ...rest unchanged, but replace the old getBlogBySlug(slug) call with the cached one above
```

3. Run `npm run build`.

**Performance check:** confirm the old second `getBlogBySlug` call in the page body is gone (replaced by the cached version) — this task should reduce blog page DB calls from 2 to 1, not keep it at 2.

**Done when:** a blog post shows a correct canonical in view-source, and visiting a nonexistent blog slug returns a clean 404 instead of a crash.

**GSC action after this task:** none yet — batch with Task 8.

---

## Task 6 — Redirects + retire duplicate routes

**Context:** `office-cleaning`, `janitorial-services`, `day-porter-services` currently exist at **3 URLs each** (flat `/services/:slug`, `/services/recurring/:slug`, `/service-area/available/:slug`) rendering identical content. `post-construction-cleaning`, `carpet-cleaning`, `window-cleaning` exist at 2 URLs each. Canonical URL family: `/services/{category}/{slug}`.

**Steps:**

1. **Fix the link sources first** (so nothing on the live site links to a URL you're about to kill):
   - `src/components/home/ServicesSection.jsx` line 79: change `` `/services/${item.slug}` `` → `` `/services/recurring/${item.slug}` ``.
   - `src/constant/service-area/index.js`: add a `category` field to each of the 6 `availableSteps` entries: `janitorial-services`, `office-cleaning`, `day-porter-services` → `category: "recurring"`; `post-construction-cleaning` → `category: "specialty"`; `carpet-cleaning`, `window-cleaning` → `category: "surface"`.
   - `src/components/service-area/Available.jsx` lines 47, 79, 111: change all three `` `/service-area/available/${service.slug}` `` → `` `/services/${service.category}/${service.slug}` ``.

2. **Add redirects** to `next.config.mjs` (currently empty except the default export):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/services/office-cleaning", destination: "/services/recurring/office-cleaning", permanent: true },
      { source: "/services/janitorial-services", destination: "/services/recurring/janitorial-services", permanent: true },
      { source: "/services/day-porter-services", destination: "/services/recurring/day-porter-services", permanent: true },
      { source: "/service-area/available/office-cleaning", destination: "/services/recurring/office-cleaning", permanent: true },
      { source: "/service-area/available/janitorial-services", destination: "/services/recurring/janitorial-services", permanent: true },
      { source: "/service-area/available/day-porter-services", destination: "/services/recurring/day-porter-services", permanent: true },
      { source: "/service-area/available/post-construction-cleaning", destination: "/services/specialty/post-construction-cleaning", permanent: true },
      { source: "/service-area/available/carpet-cleaning", destination: "/services/surface/carpet-cleaning", permanent: true },
      { source: "/service-area/available/window-cleaning", destination: "/services/surface/window-cleaning", permanent: true },
    ];
  },
};
export default nextConfig;
```

3. **Delete the now-dead route folders:** `src/app/services/[slug]/` and `src/app/service-area/available/[slug]/` (entire folders, both routes are fully superseded by the redirects + the category routes).
4. Run `npm run build`. Confirm the route count in the build output dropped by 2 (the two deleted folders) and no build errors reference the deleted paths.

**Performance check:** this task is a net performance *improvement* — 2 fewer routes to build, redirects are a static lookup table with no runtime cost, and it removes duplicate SSR work.

**Done when:** `curl -I http://localhost:3000/service-area/available/office-cleaning` (dev) returns a `308` to `/services/recurring/office-cleaning`, for all 9 old paths. And `/services/office-cleaning`, `/service-area/available/*` no longer 200 directly.

**GSC action after this task:** batch with Task 8, but this one specifically needs the "Duplicate without user-selected canonical" validation.

---

## Task 7 — Rebuild sitemap.js

**Depends on Task 2** (`getPages()` must exist).

**File:** `src/app/sitemap.js`

**Steps:**

1. Read the current file and confirm Task 2's `getPages()` exists in `src/utility/getPages.js`.
2. Confirm the exact export names before writing imports — as of this doc: `recurrings` (`services/recurring.js`), `speciality` (`services/specialty.js` — note the spelling, not "specialties"), `surfaces` (`services/surfaces.js`), `supports` (`services/support.js`), `boroughs` and `foundations` (`service-area/index.js`), `industries` (`home/industries.js`). If Tasks 3/4/6 changed any of these files' exports, re-check with a quick grep before trusting this list.
3. Replace the file:

```js
import { getBlogs } from "@/utility/getBlogs";
import { getPages } from "@/utility/getPages";
import { boroughs, foundations } from "@/constant/service-area";
import { recurrings } from "@/constant/services/recurring";
import { speciality } from "@/constant/services/specialty";
import { surfaces } from "@/constant/services/surfaces";
import { supports } from "@/constant/services/support";
import { industries } from "@/constant/home/industries";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = process.env.BASE_URL;
  const now = new Date().toISOString();
  const [blogs, cmsPages] = await Promise.all([getBlogs(), getPages()]);

  const staticPages = [
    "", "about", "services", "contact", "service-area", "booking",
    "privacy-policy", "terms-of-service", "blogs",
  ].map(path => ({ url: `${base}/${path}`, lastModified: now }));

  const serviceUrls = [
    ...recurrings.map(s => `${base}/services/recurring/${s.slug}`),
    ...speciality.map(s => `${base}/services/specialty/${s.slug}`),
    ...surfaces.map(s => `${base}/services/surface/${s.slug}`),
    ...supports.map(s => `${base}/services/support/${s.slug}`),
  ].map(url => ({ url, lastModified: now }));

  const locationUrls = boroughs.map(b => ({
    url: `${base}/service-area/${b.slug}`,
    lastModified: now,
  }));

  const foundationUrls = foundations.map(f => ({
    url: `${base}/service-area/foundation/${f.slug}`,
    lastModified: now,
  }));

  const industryUrls = industries.map(i => ({
    url: `${base}/industries/${i.slug}`,
    lastModified: now,
  }));

  const blogUrls = blogs.map(b => ({
    url: `${base}/blogs/${b.slug}`,
    lastModified: new Date(b.updatedAt).toISOString(),
  }));

  const cmsPageUrls = cmsPages.map(p => ({
    url: `${base}/${p.pageName}`,
    lastModified: new Date(p.updatedAt).toISOString(),
  }));

  return [...staticPages, ...serviceUrls, ...locationUrls, ...foundationUrls, ...industryUrls, ...blogUrls, ...cmsPageUrls];
}
```

4. Remove `/booking/thankyou` from indexing — edit `src/app/booking/thankyou/page.jsx`'s existing `export const metadata` object, add a `robots` key:

```jsx
export const metadata = {
  title: "ThankYou - New York Commercial Clean Team INC",
  description: "professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference",
  robots: { index: false, follow: false },   // <-- add
};
```

5. Run `npm run build`.

**Performance check:** `sitemap.js` is marked `force-dynamic` and now does 2 DB calls (`getBlogs`, `getPages`) instead of 1 — this only runs when something requests `/sitemap.xml` (Googlebot, mainly), not on every page load, so it doesn't affect visitor-facing performance. Confirm the two calls run in parallel (`Promise.all`, already in the snippet above) rather than sequentially.

**Done when:** `/sitemap.xml` lists roughly 115+ URLs (10 static + ~16 static service pages + 5 boroughs + foundations + industries + blogs + 74 CMS pages), and `/booking/thankyou` is no longer in it.

**GSC action after this task:** yes — resubmit the sitemap in GSC (Sitemaps → enter `sitemap.xml` → Submit), but only after this is deployed to production, not from a dev build. If Task 8 hasn't happened yet, just tell the user this is queued for Task 8's GSC pass.

---

## Task 8 — Deploy + GSC revalidation

**Only start this once Tasks 1–7 are committed and the user has reviewed and pushed them live.** This task doesn't touch code — it's the GSC-side follow-through.

**Steps:**

1. Confirm with the user that the deploy went out (check the live site reflects the changes — e.g. view-source a service page for the canonical tag).
2. Walk them through, one at a time:
   - GSC → **Sitemaps** → submit `sitemap.xml` again (URL changed shape, worth a fresh submit even though it's the same path).
   - GSC → **Pages** → **Not found (404)** → **Validate Fix**.
   - GSC → **Pages** → **Server error (5xx)** → **Validate Fix**.
   - GSC → **Pages** → **Duplicate without user-selected canonical** → **Validate Fix**.
   - GSC → **URL Inspection** → request indexing for a handful of the highest-value pages directly: the 6 canonical service pages, the 5 borough pages, and 3–5 of the highest-search-volume CMS pages (e.g. `commercial-office-cleaning-nyc`, `commercial-cleaning-services-manhattan-nyc`).
3. Set expectation: validation typically takes **3–14 days** to clear, not instant. Re-clicking "Validate Fix" daily doesn't speed it up.
4. Update `memory.md`: log the deploy date and which GSC validations were submitted.

**Done when:** all 4 validations are submitted and the sitemap is resubmitted.

---

## Task 9 — 🚫 BLOCKED — replace Lorem Ipsum facility captions

**Do not start this task until the user confirms real before/after photos exist for the 74 CMS pages.**

**Context:** every one of the 74 `PageModel` documents has `facilities[].title` set to the literal placeholder `"Lorem ipsum dolor sit amet"`. This is unrelated to the borough-copy-sharing pattern (which is intentional, client-approved) — this is a genuine placeholder that was never replaced because real photos weren't ready when the pages were built.

When unblocked, this becomes: for each of the 74 pages, replace the facility caption with a real, specific title describing that page's actual before/after photo (not more Lorem Ipsum, not another template). This is a database write, not a code change — needs a script similar to the read-only queries used to diagnose this, but writing via `PageModel.updateOne()`. Do a dry run first (print old → new for all 74 without writing), get the user's sign-off, then apply.

---

## Watch-and-revisit (not a committed task)

Once Task 8's validations clear and a few weeks of GSC data come in, check how many of the 74 CMS pages actually got indexed. If a meaningful chunk didn't (likely the lowest-search-volume borough/service combos — see the indexing-risk discussion this plan came out of), consider adding: per-page `Service`/`LocalBusiness` schema markup with `areaServed`, and cross-linking between borough variants and their parent category page. Neither touches copy. Don't build this speculatively — only if the data says it's needed.

---

## Progress tracker

- [x] Task 1 — CMS page metadata (74 pages)
- [x] Task 2 — `getPages()` utility
- [ ] Task 3 — 7 static routes guarded against 500
- [ ] Task 4 — canonical + og:url on 7 static routes
- [ ] Task 5 — blog canonical + DB call dedup
- [ ] Task 6 — redirects + duplicate routes retired
- [ ] Task 7 — sitemap rebuilt
- [ ] Task 8 — deployed + GSC validations submitted
- [ ] Task 9 — blocked, waiting on real photos

**Next action right now:** open a new Claude session, say "do Task 1 in gsc-tasks.md."
