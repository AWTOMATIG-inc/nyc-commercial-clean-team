import BlogListArea from "@/components/blogs/BlogListArea";
import HeroBanner from "@/components/HeroBanner";
export const metadata = {
  title: "Blogs - New York Commercial Clean Team INC",
  description: "professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference",
};
export default async function Blogs() {

  return (
    <main>
        <HeroBanner title="NYC Facility Cleaning Insights & Resources" desc="Commercial cleaning guides, compliance tips, and facility management best practices for NYC businesses."  pageName="Blogs"/>
        <BlogListArea/>
    </main>
  )
}
