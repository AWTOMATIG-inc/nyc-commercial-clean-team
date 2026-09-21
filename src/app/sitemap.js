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
