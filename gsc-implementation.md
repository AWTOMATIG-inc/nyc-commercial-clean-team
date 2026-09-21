# GSC Indexing Fix — Implementation Plan

**Start here:** open [src/app/(quotes)/[slug]/page.jsx](src/app/(quotes)/[slug]/page.jsx) — Phase 1 below, one file, biggest impact in the plan.

Verified against the live codebase and the live database on 2026-09-18, not just against `report.md`. Where the report guessed wrong or missed something, it's flagged below.

---

## The single biggest finding: 74 pages, one file, zero metadata

`report.md` never mentions this. It's bigger than everything else in the plan combined.

`https://nyccleantinc.com/janitorial-services-nyc` (and 73 more like it) is served by [src/app/(quotes)/[slug]/page.jsx](src/app/(quotes)/[slug]/page.jsx). The `(quotes)` folder is a route group — the parentheses don't appear in the URL — so this one file catches every root-level slug that isn't a static route.

I queried the database directly (`PageModel`, collection `pages`): **74 documents, 74 unique `pageName` values.** It's a full programmatic local-SEO grid — roughly 9 service categories × 7 boroughs (`day-porter-services-manhattan`, `commercial-window-cleaning-brooklyn`, `post-construction-cleaning-queens`, ...), plus a handful of niche single pages (`healthcare-facility-cleaning-nyc`, `school-cleaning-nyc`, `restaurant-cleaning-nyc`).

Three things are true about all 74, confirmed by reading the code and the actual DB records:

1. **The route file has no `generateMetadata` at all.** Every one of these 74 pages currently ships the root layout's literal fallback: `<title>NYC Clean Commercial Team Admin & Management</title>` and `og:url` pointing at the homepage. Google is looking at 74 URLs with an identical title tag — this is very likely the dominant contributor to the "duplicate without user-selected canonical" bucket in GSC, not the 6-URL case the report focused on.
2. **None of the 74 are in the sitemap.** There's no code path that lists them — `src/utility/getPages.js` only exports `getPageById` and `getPageBySlug`, no list-all function exists yet.
3. **The copy is template-swapped, not unique per borough.** I pulled real records: `day-porter-services-nyc`, `-brooklyn`, and `-manhattan` all share the exact same `title` field ("Day Porter Services"), and the `subTitle`/`shortDescription` differ only by the swapped city name — "Dependable day porters keeping **Brooklyn** properties clean all day." → swap word, done. This is precisely the thin/boilerplate content pattern GSC's "Crawled – currently not indexed" reason describes, at 74-page scale.

These pages are legitimate local-SEO landing pages, not throwaway PPC-only pages — they carry unique feature lists, stat counters, and before/after facility photo galleries per page, which isn't something you'd build for ad-only landing pages. Default recommendation: **index all 74**, fix their metadata, add them to the sitemap, and separately fix the copy-uniqueness problem so Google doesn't fold them together once it can see them.

### 1a. Add metadata + canonical (30 min, fixes all 74 at once)

Edit [src/app/(quotes)/[slug]/page.jsx](src/app/(quotes)/[slug]/page.jsx):

```jsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pageDetail = await getPageBySlug(slug);
  if (!pageDetail) return {};
  const url = `https://nyccleantinc.com/${slug}`;
  return {
    title: `${pageDetail.title} | NYC Commercial Clean Team`,
    description: pageDetail.shortDescription,
    alternates: { canonical: url },
    openGraph: { url, title: pageDetail.title, description: pageDetail.shortDescription },
  };
}
```

Place it above the existing `export default async function Quotes(...)`. It reuses `getPageBySlug`, which the file already imports.

**Done when:** view-source on `/janitorial-services-nyc` shows a unique `<title>` and `<link rel="canonical" href="https://nyccleantinc.com/janitorial-services-nyc">`.

### 1b. Add a list-all function and put all 74 in the sitemap (1 hr)

`src/utility/getPages.js` has no way to fetch every page. Add one:

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

This gets wired into `sitemap.js` in Phase 5 — don't duplicate that step here.

### 1c. Fix the thin-content pattern (ongoing, ~10–15 min per page × 74)

Once these pages are indexable, the swap-the-city-name copy is a real risk for the same reason the report flagged for the 6 static duplicate pages: Google's quality systems fold near-identical pages together. Each of the 74 needs at least one borough-specific paragraph — a real neighborhood reference, a building type common to that borough, a client type — not just the city name substituted into the same sentence. This is a content task, not a code task; do it through the dashboard editor a handful of pages at a time. Prioritize the highest-search-volume boroughs first (Manhattan, Brooklyn, Queens) rather than all 74 at once.

**Don't block Phase 1a/1b on this.** Ship the metadata and sitemap fix now; do the content pass over the following weeks.

---

## What else is true (verified, not guessed)

1. **Zero canonical tags anywhere else either.** No static-constant-driven route calls `alternates.canonical`. Confirmed by reading every `page.jsx` under dynamic routes.
2. **`og:url` is hardcoded to the homepage** in [src/app/layout.js:33](src/app/layout.js#L33) and never overridden by any child route — including blog posts.
3. **6 pieces of static service content live at up to 3 URLs each** (worse than the report's "12 duplicate URLs" — it's actually **15 URLs** for 6 pieces of content). Details in Phase 4.
4. **6 dynamic routes crash to a 500 instead of a clean 404** when the slug doesn't match — this is the real cause of both the 404 bucket and the 5xx bucket, not database timeouts.
5. **Sitemap has 10 static URLs + blogs.** Missing services, service-area, industries — and all 74 CMS pages above.

### Where `report.md` was wrong or incomplete

- **It never found the 74-page CMS route at all** — it only saw the ~15 statically-duplicated service URLs, which is a fraction of the real gap.
- **5xx root cause isn't DB pooling.** `services/[slug]`, `services/recurring/[slug]`, `services/surface/[slug]`, `services/support/[slug]`, `industries/[slug]`, and `service-area/foundation/[slug]` read from **static JS arrays in `src/constant/`**, not a database. They crash because they do `detail.heading` with no check that `detail` exists — any unmatched slug throws a `TypeError`, which Next.js renders as a 500. Blog pages (`blogs/[slug]`) are the one route that's actually DB-backed, and they crash for a different reason: `getBlogBySlug` returns `null` on no match, and `generateMetadata` does `blog.title` with no null guard.
- **The single redirect rule the report proposed doesn't work.** It suggested `/service-area/available/:slug → /services/recurring/:slug` for all 6 duplicate slugs. Only 3 of those 6 (`office-cleaning`, `janitorial-services`, `day-porter-services`) belong to the "recurring" category — the other 3 belong to `specialty` and `surface`. A wildcard redirect sends them to the wrong category and 404s them. You need 9 explicit pairs — full list in Phase 4.
- **There's a third static duplicate the report never mentioned.** `office-cleaning`, `janitorial-services`, and `day-porter-services` each exist at **three** URLs: `/services/office-cleaning` (flat route, linked from the homepage), `/services/recurring/office-cleaning`, and `/service-area/available/office-cleaning`. All three render the exact same object from `src/constant/services/index.js`.
- **robots.txt is fine.** The report flagged it as a concern; it correctly blocks `/dashboard/*` and points to the sitemap. No action needed.

---

## Phase 2 — Stop the 500s on static routes (2–3 hrs)

Every dynamic route below does `array.find(x => x.slug === slug)` and then immediately reads a property off the result with no check. Fix: guard + `notFound()`.

- [ ] `src/app/services/[slug]/page.jsx`
- [ ] `src/app/services/recurring/[slug]/page.jsx`
- [ ] `src/app/services/surface/[slug]/page.jsx`
- [ ] `src/app/services/support/[slug]/page.jsx`
- [ ] `src/app/services/specialty/[slug]/page.jsx`
- [ ] `src/app/industries/[slug]/page.jsx`
- [ ] `src/app/service-area/foundation/[slug]/page.jsx`

**Pattern to apply to each** (example for `services/[slug]/page.jsx`):

```jsx
import { notFound } from "next/navigation";

export default async function ServicesDetails({ params }) {
  const { slug } = await params;
  const service = services.find(service => service.slug === slug);
  const detail = details.find(service => service.slug === slug);
  if (!service || !detail) notFound();  // <-- add this line
  return ( ... )
}
```

**Blog fix is different** — `src/app/blogs/[slug]/page.jsx:8-15`:

```jsx
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};          // <-- add: stops the crash in generateMetadata
  return {
    title: `Blogs - ${blog.title} |`,
    description: blog.shortDescription || blog.metaDescription,
  };
}
export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();         // <-- add: same guard in the page body
  ...
}
```

**Done when:** visiting any nonexistent slug under these 8 routes returns a real Next.js 404 page, not a crash. Spot-check: `/services/not-a-real-slug`, `/blogs/not-a-real-slug`.

---

## Phase 3 — Canonical tags + og:url on static routes (3–4 hrs)

Same fix shape everywhere:

```jsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const detail = details.find(d => d.slug === slug);
  if (!detail) return {};
  const url = `https://nyccleantinc.com/services/recurring/${slug}`; // adjust path per route
  return {
    title: `${detail.heading} | NYC Commercial Clean Team`,   // kills the boilerplate admin title
    description: detail.desc,
    alternates: { canonical: url },
    openGraph: { url },                                        // kills the hardcoded homepage og:url
  };
}
```

Apply to:

- [ ] `services/recurring/[slug]` — canonical path: `/services/recurring/:slug`
- [ ] `services/specialty/[slug]` — canonical path: `/services/specialty/:slug`
- [ ] `services/surface/[slug]` — canonical path: `/services/surface/:slug`
- [ ] `services/support/[slug]` — canonical path: `/services/support/:slug`
- [ ] `industries/[slug]` — canonical path: `/industries/:slug`
- [ ] `service-area/[slug]` (boroughs) — already has a `generateMetadata`, just add `alternates.canonical` and `openGraph.url` to the existing return object at [page.jsx:14-17](src/app/service-area/[slug]/page.jsx#L14)
- [ ] `blogs/[slug]` — add `alternates.canonical` to the existing `generateMetadata`

Skip `services/[slug]` (flat route) and `service-area/available/[slug]` — both get deleted or redirected in Phase 4, don't waste time adding metadata to a page you're about to remove.

**Done when:** view-source on a live service/location page shows `<link rel="canonical" href="...">` and the og:url matches that page's own URL, not the homepage.

---

## Phase 4 — Kill the duplicate static routes (2–3 hrs)

**Decide the canonical URL family first:** keep `/services/{category}/{slug}` (recurring / specialty / surface / support) as the one true URL per service. It's the version linked from the main `/services` page and matches the site's actual content taxonomy.

### 4a. Retire the flat `/services/[slug]` route

Only 3 slugs ever populate it (`src/constant/home/services.js`), and all 3 already exist at `/services/recurring/{slug}`.

1. Fix the source: in `src/components/home/ServicesSection.jsx:79`, change the `Link href` from `` `/services/${item.slug}` `` to `` `/services/recurring/${item.slug}` ``.
2. Delete `src/app/services/[slug]/` entirely (the route folder, not the `services/recurring` one).
3. Add a redirect anyway (below) in case Google or an old backlink still hits the dead URL.

### 4b. Redirect `/service-area/available/[slug]` — 6 explicit pairs, not 1 wildcard

Add to [next.config.mjs](next.config.mjs):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // retired flat /services/[slug] route
      { source: "/services/office-cleaning", destination: "/services/recurring/office-cleaning", permanent: true },
      { source: "/services/janitorial-services", destination: "/services/recurring/janitorial-services", permanent: true },
      { source: "/services/day-porter-services", destination: "/services/recurring/day-porter-services", permanent: true },
      // duplicate /service-area/available/[slug] routes — mapped to the RIGHT category each
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

Then fix the source of those links too — `src/components/service-area/Available.jsx:47,79,111` currently builds `` `/service-area/available/${service.slug}` ``. Point it at the same per-category mapping used above (or simplest: give each `availableSteps` entry in `src/constant/service-area/index.js` a `category` field and build the href from that, so the component isn't hardcoding a dead path family going forward).

4. Delete `src/app/service-area/available/[slug]/` once the redirects are live and the source links are fixed.

**Done when:** `curl -I https://nyccleantinc.com/service-area/available/office-cleaning` returns `308` (permanent redirect) to `/services/recurring/office-cleaning`, for all 9 old paths.

---

## Phase 5 — Rebuild the sitemap (2 hrs)

[src/app/sitemap.js](src/app/sitemap.js) currently outputs 10 static URLs + blogs. Rewrite it to include every indexable route, including the 74 CMS pages from Phase 1b:

```js
import { getBlogs } from "@/utility/getBlogs";
import { getPages } from "@/utility/getPages";
import { boroughs } from "@/constant/service-area";
import { recurrings } from "@/constant/services/recurring";
import { specialties } from "@/constant/services/specialty";
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
    ...specialties.map(s => `${base}/services/specialty/${s.slug}`),
    ...surfaces.map(s => `${base}/services/surface/${s.slug}`),
    ...supports.map(s => `${base}/services/support/${s.slug}`),
  ].map(url => ({ url, lastModified: now }));

  const locationUrls = boroughs.map(b => ({
    url: `${base}/service-area/${b.slug}`,
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

  return [...staticPages, ...serviceUrls, ...locationUrls, ...industryUrls, ...blogUrls, ...cmsPageUrls];
}
```

Adjust the import names to match whatever each constant file actually exports (check `src/constant/services/specialty.js`, `surfaces.js`, `support.js` export names before pasting).

**Also:** remove `/booking/thankyou` — it's currently in the sitemap and shouldn't be. Add to `src/app/booking/thankyou/page.jsx`:

```jsx
export const metadata = { robots: { index: false, follow: false } };
```

**Done when:** `https://nyccleantinc.com/sitemap.xml` lists **~115+ URLs** (10 static + ~16 static service pages + 5 boroughs + industries + blogs + 74 CMS pages), and `/booking/thankyou` is gone from it. This is the number that actually matters — going from 21 URLs in the sitemap to ~115+ is the core fix for the "130 known pages, only 21 in sitemap" gap the report identified.

---

## Phase 6 — Deploy and revalidate in GSC (30 min + wait time)

1. Deploy Phases 1–5 together (they're interdependent — redirects reference routes that need the notFound guards).
2. GSC → **Pages** → **Not found (404)** → **Validate Fix**.
3. GSC → **Pages** → **Server error (5xx)** → **Validate Fix**.
4. GSC → **Pages** → **Duplicate without user-selected canonical** → **Validate Fix**.
5. GSC → **URL Inspection** → submit the new sitemap URL and request indexing for a handful of the highest-value pages directly: the 6 canonical service pages, the 5 borough pages, and 3–5 of the highest-search-volume CMS pages (e.g. `commercial-office-cleaning-nyc`, `commercial-cleaning-services-manhattan-nyc`).

Google re-crawls on its own schedule after this — validation typically takes **3–14 days** to clear, not instant. Don't re-click "Validate Fix" daily; it doesn't speed anything up.

---

## Progress tracker

- [ ] Phase 1 — 74 CMS pages: metadata added, `getPages()` written, content-uniqueness pass started
- [ ] Phase 2 — 8 static routes guarded against crash-to-500
- [ ] Phase 3 — canonical + og:url on 7 static routes
- [ ] Phase 4 — 9 redirects live, 2 dead route folders deleted, 2 link sources fixed
- [ ] Phase 5 — sitemap rebuilt with all ~115 URLs, thank-you page noindexed
- [ ] Phase 6 — deployed, GSC validations submitted

**Next action right now:** open [src/app/(quotes)/[slug]/page.jsx](src/app/(quotes)/[slug]/page.jsx) and add the `generateMetadata` function from Phase 1a. One function, fixes metadata for 74 pages at once, 30 minutes.
