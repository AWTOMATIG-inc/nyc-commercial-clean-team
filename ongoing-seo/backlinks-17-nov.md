# Old-Page Cleanup Report: 17 November 2026

## What we reviewed

1. **Backlinks report (Semrush).** A list of 59 old nyccleantinc.com web addresses from the previous version of the website. None of them has any other website linking to it, so no ranking value is attached to them.
2. **Google Search Console "Not found (404)" report.** The list of addresses Google itself still reports as missing. It contains 18 addresses. This number has fallen from 31 in August to 19 and has been steady since.

## What we found

**Nothing is broken on the current website.** These addresses were not created by the new site. They are leftovers that Google and Semrush still remember from the previous WordPress site, which was removed almost a year ago. The new sitemap tells Google which pages exist today, but it does not make Google forget addresses it already knows. Google keeps re-checking old addresses and drops them gradually, which is why the count has fallen from 31 to 19 but has not reached zero.

A "page not found" result is the correct answer for a page that no longer exists, and Google will keep clearing these on its own. The forwarding we set up below is optional tidy-up. It tidies the Search Console report and sends any stray visitors to a relevant page, but it does not change rankings.

- The old addresses are former service pages, borough pages, blog posts, category pages and a gallery page that no longer exist.
- Some entries in the Semrush list were flagged as server errors. We checked each one on the live website. They are not errors today; they now show the standard "page not found" result. The report was an out-of-date snapshot.
- The `www` version of the site already forwards visitors to the main version, so nothing is needed there.

## What we fixed

We set up permanent forwarding for the 14 real old pages that Google still lists. A visitor or search engine that reaches one of these addresses is now sent to the closest current page.

| Old page | Now forwards to |
|---|---|
| Old blog list pages (`/blogs/2`, `/blogs/3`) | Blog page |
| Brooklyn cleaning service (old page) | Commercial Cleaning Brooklyn |
| Queens cleaning service (old page) | Commercial Cleaning Queens |
| Manhattan office cleaning (old page) | Commercial Cleaning Services Manhattan |
| Cleaning and disinfecting offices (old page) | Commercial Deep Cleaning |
| Cleaning vs disinfection vs sterilization (old page) | Commercial Deep Cleaning |
| "Top 10 benefits" and "Ultimate guide" (old blog posts) | Blog page |
| Two old blog category pages | Blog page |
| "Cleaning services new me" (two variants) | Homepage |
| Old Gallery page | Homepage |
| Old Disclaimer page | Homepage |

## What we deliberately left alone

- **Four meaningless addresses** (for example, ones that are just a `$`, `&` or `*`, and a WordPress admin file). Search engines probe these automatically. A "not found" result is the correct answer, and they do no harm.
- **The remaining old addresses in the Semrush list.** Google does not list them as problems and nothing links to them, so forwarding them would add no benefit.

## Next steps

1. We will ask Google to re-check the fixed addresses in Search Console. Google decides how long this takes, and the status will show as "Started", then "Passed".
2. The four meaningless addresses may keep the report from showing a full pass. This is expected and does not affect the website.
3. We will review the report again periodically to catch any new missing pages.

No action is needed from you at this stage.
