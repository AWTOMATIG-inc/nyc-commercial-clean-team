import { getBlogs } from "@/utility/getBlogs";
import BlogCard from "./BlogCard";

export default async function BlogListArea() {
  const blogs = await getBlogs();
  return (
    <section className="container my-8 sm:my-16">
      {blogs.length <= 0 ? (
        <p>There is no blog</p>
      ) : (
        <div className="mt-8 sm:mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {blogs.map((item) => (
            <BlogCard key={item._id} blog={item} />
          ))}
        </div>
      )}
    </section>
  );
}
