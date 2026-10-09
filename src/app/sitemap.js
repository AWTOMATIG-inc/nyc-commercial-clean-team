import { getBlogs } from "@/utility/getBlogs";
import { getPages } from "@/utility/getPages";
import { foundations } from "@/constant/service-area";
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

  // Old /services/... and /service-area/<borough> duplicate pages are deliberately
  // left out: they now 301-redirect to the stronger keyword pages, which are
  // already covered by cmsPageUrls below (GSC fix, 10-4-26).

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

  return [...staticPages, ...foundationUrls, ...industryUrls, ...blogUrls, ...cmsPageUrls];
}
