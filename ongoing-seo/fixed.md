# Website Fix Pack, Part 1 — What Was Done

Developer log against `FIX.md`. Covers Fixes 1–6. All six are implemented, committed, pushed to `origin/main`, and confirmed live on production via direct `curl` checks.

---

## Fix 1: Merge duplicate pages — Done, live

**301s added** in `next.config.mjs` for all 16 old URLs listed in `FIX.md`, pointing straight at the stronger keyword page (single hop, not chained through an intermediate URL).

**Internal links updated** to point at the "keep" pages instead of the old ones:
- `src/constant/footer.js` — footer service links
- `src/components/home/ServicesSection.jsx` — homepage service cards
- `src/components/service-area/Available.jsx` + `src/constant/service-area/index.js` — service-area "Available" section (added a `category` field per service to build the new URL)
- `src/components/services/RecurringSection.jsx`, `SpecialitySection.jsx`, `SupportSection.jsx`, `SurfacesSection.jsx` + matching `src/constant/services/*.js` — cross-links between service category pages
- `src/components/service-area/Coverage.jsx` — service-area step links
- `src/constant/home/services.js`

**Sitemap** (`src/app/sitemap.js`) — old `/services/...` and `/service-area/<borough>` URLs removed from the generated sitemap; the stronger pages they redirect to were already present via the CMS page list.

**Verified live:**
```
curl -sI https://nyccleantinc.com/service-area/queens              -> 308
curl -sI https://nyccleantinc.com/services/recurring/office-cleaning -> 308
curl -sI https://nyccleantinc.com/services/support/handyman-services -> 308
```

---

## Fix 2: Titles and descriptions on the money pages — Done, live

This is CMS-backed content (MongoDB `PageModel`, served via `src/app/(quotes)/[slug]/page.jsx`), so it was a **database write**, not a code change. `generateMetadata` on that route already builds `<title>` from `pageDetail.title` and the meta description from `pageDetail.shortDescription` — no code to touch.

Did a dry run first (printed old → new for all 7 pages, confirmed every `<title>` lands under 60 characters), then applied via `PageModel.updateOne()` after explicit sign-off.

**Pages updated** (`title`, `shortDescription`, and `subTitle`/H1 where `FIX.md` specified a new one):
- `/commercial-office-cleaning-nyc`
- `/janitorial-services-nyc`
- `/restaurant-cleaning-nyc`
- `/healthcare-facility-cleaning-nyc`
- `/commercial-cleaning-queens`
- `/commercial-cleaning-brooklyn`
- `/commercial-cleaning-services-manhattan-nyc`

**Verified live:**
```
curl -s https://nyccleantinc.com/commercial-office-cleaning-nyc | grep '<title>'
-> Office Cleaning Services NYC | NYC Commercial Clean Team
```

---

## Fix 3: One H1 per page — Done, live

`FIX.md` only called out the homepage (7 H1s), but the root cause was a **shared component**, so the real fix was site-wide.

**Root cause:** `src/components/Counter.jsx` (the animated stat-number component) rendered its output as `<h1>`. It's reused everywhere stats appear — homepage `WhySection` (5 instances), about page `ExpertiseSection` + `BestCustomerReviews` (5 instances), and the stats block on every one of the 74 CMS pages (4 per page). Fixed once, in one file: `<h1>` → `<p>`.

**One-off duplicate H1s fixed individually** (same pattern — a decorative or secondary heading wrongly set to `<h1>` on a page that already has a real H1 elsewhere):
- `src/components/about/WhyChooseUs.jsx` — "5000+" stat → `<p>`; per-item process titles → `<h5>`
- `src/components/Booking/RightSideContentBox.jsx` — "What's Included" / "Services We Offer" / "Prefer to Talk?" sidebar titles → `<h3>`
- `src/app/blogs/[slug]/page.jsx` — "N Comments" heading → `<h2>`
- `src/components/service-area/Available.jsx` — "Ready to upgrade" CTA (duplicate H1 on `/service-area`, which already has its H1 from `HeroBanner`) → `<h2>`

**Verified live:** `curl -s https://nyccleantinc.com | grep -o '<h1' | wc -l` → `1`

---

## Fix 4: Add address and phone to the footer — Done, live

`src/components/Footer.jsx` — removed the generic "Professional commercial cleaning services across all five NYC boroughs..." tagline paragraph, replaced with the real address and a clickable phone number:

```jsx
<p>146-61 107th Ave, Suite 1, Jamaica, NY 11435</p>
<a href="tel:+16313817252" className="hover:underline">+1 (631) 381-7252</a>
```

Same plain `tel:` link pattern used on the contact page (`src/components/contact/Contactinfo.jsx`) — no JS needed, tapping it prompts a native call on mobile.

---

## Fix 5: LocalBusiness structured data (homepage) — Done, live

The homepage (`src/app/page.js`) already had a `LocalBusiness` JSON-LD block, but the address was incomplete and wrong (`addressLocality: "New York"`, no street or postal code). Filled in the real official details:

```js
address: {
  "@type": "PostalAddress",
  streetAddress: "146-61 107th Ave, Suite 1",
  addressLocality: "Jamaica",
  addressRegion: "NY",
  postalCode: "11435",
  addressCountry: "US",
},
```

No star rating added, per `FIX.md`'s warning (no real reviews wired into this block).

**Verified live:**
```
curl -s https://nyccleantinc.com | grep -o '"streetAddress":"[^"]*"'
-> "streetAddress":"146-61 107th Ave, Suite 1"
```

---

## Fix 6: www vs non-www — Done, live

Site is self-hosted behind nginx, not Vercel — both `nyccleantinc.com` and `www.nyccleantinc.com` were hitting the same Next.js app and both returned `200` directly (confirmed via `curl` before the fix — identical `Content-Length` on both hosts).

Added a host-matched redirect in `next.config.mjs`, first in the `redirects()` array so it fires before any path-specific rule:

```js
{
  source: "/:path*",
  has: [{ type: "host", value: "www.nyccleantinc.com" }],
  destination: "https://nyccleantinc.com/:path*",
  permanent: true,
}
```

**Verified live:** `curl -sIL https://www.nyccleantinc.com` → `308` → `https://nyccleantinc.com` → `200`.

---

## Deploy / commit record

- `c88ace4` — Fix 1 (redirects + link updates + sitemap), Fix 3 (H1 cleanup), Fix 5 (structured data), Fix 6 (www redirect)
- `ee9f762` — Fix 4 (footer address/phone)
- Fix 2 — database write, no commit (not a code change)

All pushed to `origin/main`, deployed, and spot-checked live with `curl` (see verification notes under each fix above).

## What's left

Nothing outstanding from this fix pack. `FIX.md`'s "Coming in part 2" items (the ~70 thin service+borough pages, a stronger Queens home-borough page) are out of scope here — not started.
