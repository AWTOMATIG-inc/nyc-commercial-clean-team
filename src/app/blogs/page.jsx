import BlogListArea from "@/components/blogs/BlogListArea";
import HeroBanner from "@/components/HeroBanner";

export default async function Blogs() {

  return (
    <main>
        <HeroBanner title="NYC Facility Cleaning Insights & Resources" desc="Commercial cleaning guides, compliance tips, and facility management best practices for NYC businesses."  pageName="Blogs"/>
        <BlogListArea/>
    </main>
  )
}
