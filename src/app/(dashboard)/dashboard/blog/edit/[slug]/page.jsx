import BlogForm from "@/components/dashboard/blog/Blogform";
import { getBlogBySlug } from "@/utility/getBlogs";

export default async function BlogEdit({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return (
    <div>
      <BlogForm blog={blog} />
    </div>
  );
}
