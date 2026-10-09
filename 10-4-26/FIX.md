# Website Fix Pack, Part 1: nyccleantinc.com

**Prepared:** 2026-10-06, from a live read of the site
**Stack:** Next.js (React), so your web developer applies these in code
**Status:** Nothing has been changed yet

Apply the fixes in order. Each fix says why it matters.

**Official business details (use on every page):**
New York Commercial Clean Team Inc., 146-61 107th Ave, Suite 1, Jamaica, NY 11435, (631) 381-7252

---

## Fix 1: Merge duplicate pages (biggest ranking gain)

You have two pages competing for each main keyword. Google splits ranking signals between them, so neither ranks. The newer keyword pages are the stronger ones (one H1, 1,200 to 2,400 words). The older `/services/...` and `/service-area/...` pages have no H1 or two H1s and less text.

Permanently redirect (301) the weaker page to the stronger one:

| Old page (redirect from) | Keep (redirect to) | Why |
|---|---|---|
| `/services/recurring/office-cleaning` | `/commercial-office-cleaning-nyc` | Old page: no H1, ~520 words |
| `/services/recurring/janitorial-services` | `/janitorial-services-nyc` | Old page: no H1, ~650 words |
| `/services/recurring/day-porter-services` | `/day-porter-services-nyc` | Same pattern |
| `/services/specialty/post-construction-cleaning` | `/post-construction-cleaning-nyc` | Same pattern |
| `/services/specialty/deep-cleaning-disinfection` | `/commercial-deep-cleaning-nyc` | Same pattern |
| `/services/specialty/move-out-event-cleaning` | `/commercial-move-out-cleaning-nyc` | Same pattern |
| `/services/surface/floor-strip-and-wax` | `/floor-stripping-waxing-nyc` | Same pattern |
| `/services/surface/carpet-cleaning` | `/commercial-carpet-cleaning-nyc` | Same pattern |
| `/services/surface/window-cleaning` | `/commercial-window-cleaning-nyc` | Same pattern |
| `/services/support/handyman-services` | `/commercial-handyman-services-nyc` | Same pattern |
| `/services/support/restroom-supply-management` | `/restroom-supply-management-nyc` | Same pattern |
| `/service-area/queens` | `/commercial-cleaning-queens` | Old page: 2 H1s, no phone, ~850 words |
| `/service-area/brooklyn` | `/commercial-cleaning-brooklyn` | Same pattern |
| `/service-area/manhattan` | `/commercial-cleaning-services-manhattan-nyc` | Same pattern |
| `/service-area/bronx` | `/commercial-cleaning-bronx` | Same pattern |
| `/service-area/long-island` | `/commercial-cleaning-long-island` | Same pattern |

**For the developer, in `next.config.js`:**

```js
async redirects() {
  return [
    // Service pages
    { source: '/services/recurring/office-cleaning', destination: '/commercial-office-cleaning-nyc', permanent: true },
    { source: '/services/recurring/janitorial-services', destination: '/janitorial-services-nyc', permanent: true },
    { source: '/services/recurring/day-porter-services', destination: '/day-porter-services-nyc', permanent: true },
    { source: '/services/specialty/post-construction-cleaning', destination: '/post-construction-cleaning-nyc', permanent: true },
    { source: '/services/specialty/deep-cleaning-disinfection', destination: '/commercial-deep-cleaning-nyc', permanent: true },
    { source: '/services/specialty/move-out-event-cleaning', destination: '/commercial-move-out-cleaning-nyc', permanent: true },
    { source: '/services/surface/floor-strip-and-wax', destination: '/floor-stripping-waxing-nyc', permanent: true },
    { source: '/services/surface/carpet-cleaning', destination: '/commercial-carpet-cleaning-nyc', permanent: true },
    { source: '/services/surface/window-cleaning', destination: '/commercial-window-cleaning-nyc', permanent: true },
    { source: '/services/support/handyman-services', destination: '/commercial-handyman-services-nyc', permanent: true },
    { source: '/services/support/restroom-supply-management', destination: '/restroom-supply-management-nyc', permanent: true },

    // Service-area pages
    { source: '/service-area/queens', destination: '/commercial-cleaning-queens', permanent: true },
    { source: '/service-area/brooklyn', destination: '/commercial-cleaning-brooklyn', permanent: true },
    { source: '/service-area/manhattan', destination: '/commercial-cleaning-services-manhattan-nyc', permanent: true },
    { source: '/service-area/bronx', destination: '/commercial-cleaning-bronx', permanent: true },
    { source: '/service-area/long-island', destination: '/commercial-cleaning-long-island', permanent: true },
  ]
}
```

Then update the site menu and any internal links to point at the "keep" pages, and remove the old URLs from `sitemap.xml`.

---

## Fix 2: Titles and descriptions on the money pages

Titles now are generic ("Commercial Cleaning Services | NYC Commercial Clean Team" is used on the Queens page too). Each title should lead with the exact search term.

| Page | New title (under 60 characters) | New meta description |
|---|---|---|
| `/` (homepage) | Commercial Cleaning Services NYC \| NYC Clean Team | (keep current) |
| `/commercial-office-cleaning-nyc` | Office Cleaning Services NYC \| NYC Clean Team | Nightly and weekly office cleaning across all 5 boroughs. Insured crews, after-hours schedules, free walkthrough. Call (631) 381-7252. |
| `/janitorial-services-nyc` | Janitorial Services NYC \| NYC Clean Team | Fully managed janitorial programs for NYC offices and buildings. Our own insured staff, custom schedules, free quote in 24 hours. |
| `/restaurant-cleaning-nyc` | Restaurant Cleaning NYC \| NYC Clean Team | Kitchen and dining room cleaning that helps NYC restaurants pass health inspections. Overnight crews, degreasing, floors. Free quote. |
| `/healthcare-facility-cleaning-nyc` | Medical Office Cleaning NYC \| NYC Clean Team | OSHA-aware cleaning and disinfection for NYC medical and dental offices. Trained, insured crews and after-hours service. |
| `/commercial-cleaning-queens` | Commercial Cleaning Queens, NY \| NYC Clean Team | Jamaica-based commercial cleaners serving Long Island City, Flushing, Astoria and all of Queens. Offices, medical, retail. Free quote. |
| `/commercial-cleaning-brooklyn` | Commercial Cleaning Brooklyn \| NYC Clean Team | Office and commercial cleaning across Downtown Brooklyn, Williamsburg, Bushwick and beyond. Insured crews and flexible schedules. |
| `/commercial-cleaning-services-manhattan-nyc` | Office Cleaning Manhattan \| NYC Clean Team | After-hours office cleaning for Midtown, FiDi, Chelsea and every Manhattan neighborhood. Insured crews, free walkthrough. |

**H1s on the same pages:**

| Page | New H1 |
|---|---|
| `/commercial-office-cleaning-nyc` | Office Cleaning Services in NYC |
| `/janitorial-services-nyc` | Janitorial Services in NYC |
| `/restaurant-cleaning-nyc` | Restaurant Cleaning in NYC |

---

## Fix 3: One H1 per page (site-wide template fix)

The homepage has 7 H1s. Only the first ("Commercial Cleaning & Facility Maintenance for NYC Properties") should stay H1; change the other six section titles to H2.

Do the same in the shared section component, so "Request Pricing" is never an H1 on any page.

---

## Fix 4: Add your address and phone to the footer

The footer shows no address and no phone. Put the full official details (see top of this document) in the site-wide footer. Google uses this to match the site to your Google Business Profile.

---

## Fix 5: Add LocalBusiness structured data (homepage)

Paste into the homepage `<head>` (in Next.js, as a `<script type="application/ld+json">` in the layout):

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "New York Commercial Clean Team Inc.",
  "url": "https://nyccleantinc.com/",
  "telephone": "+1-631-381-7252",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "146-61 107th Ave, Suite 1",
    "addressLocality": "Jamaica",
    "addressRegion": "NY",
    "postalCode": "11435",
    "addressCountry": "US"
  },
  "areaServed": ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Long Island"],
  "priceRange": "$$"
}
```

> Don't add a star rating to this code unless it comes from real reviews shown on the page. Google penalizes self-made ratings.

---

## Fix 6: www vs non-www

Have the developer confirm that `www.nyccleantinc.com` returns a 301 redirect to `https://nyccleantinc.com` on every URL (set this in the hosting or DNS settings). Google has indexed some pages on www, which splits ranking.

---

## Coming in part 2

- Handling the ~70 thin "service + borough" pages (for example `/floor-stripping-waxing-bronx`)
- A stronger Queens page as your home-borough page