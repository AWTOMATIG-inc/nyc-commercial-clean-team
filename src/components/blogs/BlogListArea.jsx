import { blogs } from "@/constant/blogs/blogs";
import BlogCard from "./BlogCard";

export default function BlogListArea() {
  return (
    <section className="container my-8 sm:my-16">
      <div className="mt-8 sm:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
        {blogs.slice(0, 3).map((item) => (
          <BlogCard key={item.id} blog={item} />
        ))}
      </div>
    </section>
  );
}
