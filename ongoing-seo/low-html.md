# Low Text-to-HTML Ratio: What We Fixed

**Site:** nyccleantinc.com
**Based on:** Semrush Site Audit, generated October 18, 2026 (issue: "Low text to HTML ratio")

## Summary

Semrush flagged 33 pages for having a low share of readable text compared with page code. We investigated and found that this was caused by two real problems on the homepage and the Blogs page, which were making those pages far heavier than they needed to be. Both are fixed. We also added useful content to the Contact and About pages.

The other flagged pages are still below Semrush's 10% line, so you should expect the issue to appear again in the next audit. Ratios will be higher, and the homepage and Blogs page will no longer be the worst offenders. Details and our reasoning are below.

## What the issue means

Semrush flags a page when readable text is 10% or less of the page's total code. The report lists values as fractions, so 0.07 means 7%. Google does not use this ratio as a ranking factor, and Semrush rates it as a low-severity notice. It matters mostly when it points to a page that is unusually heavy, which is what we found.

## What we found and fixed

| #   | Problem                                                                                                                                                                      | Fix                                                                                                                                            | Result                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | **Homepage** carried 12 large embedded images inside its code (icons saved as encoded image data, some repeated). This made the page 715 KB with only 7 KB of readable text. | Moved the 9 icons into small, separate image files (1 to 6 KB each). The icons look the same as before.                                        | Page size 715 KB to 117 KB (down 84%). Ratio 1% to 6.1%.  |
| 2   | **Blogs page** was sending the full text of every blog post to the visitor's browser, even though it only displays a title and summary for each.                             | Changed the blog cards so the full text is no longer sent to the browser.                                                                      | Page size 230 KB to 59 KB (down 74%). Ratio 1.5% to 5.6%. |
| 3   | **Contact** and **About** pages had very little text.                                                                                                                        | Added about 120 words of useful content to each: what happens after you contact us, who we work with, how we work, services, and areas served. | Contact 3.5% to 5.8%. About 4.1% to 4.9%.                 |

Faster pages help visitors and also help search engines crawl the site more easily, which is the real benefit of fixes 1 and 2.

## Before and after

"Before" is the Semrush value from the October 18 report. "After" was measured on a test build of the updated site before release.

| Page                                                    | Before (Semrush) | After                     |
| ------------------------------------------------------- | ---------------- | ------------------------- |
| Homepage                                                | 1%               | 6.1%                      |
| Blogs                                                   | 1%               | 5.6%                      |
| Contact                                                 | 3%               | 5.8%                      |
| About                                                   | 2%               | 4.9%                      |
| Booking                                                 | 4%               | 4.5% (no change made)     |
| Locations (service area)                                | 5%               | 5.4% (no change made)     |
| Privacy Policy                                          | 5%               | 5.6% (no change made)     |
| Services                                                | 7%               | 7.0% (no change made)     |
| Service and location pages (janitorial, Brooklyn, etc.) | 7%               | about 7% (no change made) |

Pages we did not touch were not re-measured individually, apart from those in the table.

## What is not fixed, and why

- **Every flagged page is still under 10%.** Most service and location pages sit around 7%.
- **Getting them to 10% would take about 300 more words of text on each of roughly 25 pages.** We did not do this because the ratio does not affect rankings and the added copy would be written mainly to move a score, not to help visitors.
- **We checked the rest of the homepage code** and found nothing else worth removing. What remains is the page's own content and design styling.
