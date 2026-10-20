import BlogListArea from "@/components/blogs/BlogListArea";
import HeroBanner from "@/components/HeroBanner";
import { pageMeta } from "@/utility/pageMeta";
export const metadata = pageMeta({
  path: "/blogs",
  title: "Blogs - New York Commercial Clean Team INC",
  description:
    "Commercial cleaning guides, compliance tips and facility management best practices for NYC businesses, from the New York Commercial Clean Team.",
});
export default async function Blogs() {

  return (
    <main>
        <HeroBanner imageURL="/images/banners/blogs.webp" title="NYC Facility Cleaning Insights & Resources" desc="Commercial cleaning guides, compliance tips, and facility management best practices for NYC businesses."  pageName="Blogs"/>
        <BlogListArea/>
    </main>
  )
}
