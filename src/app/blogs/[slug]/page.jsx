import CommentForm from "@/components/blogs/CommentForm";
import { getBlogBySlug, getBlogLinks } from "@/utility/getBlogs";
import { GetTime } from "@/utility/GetTime";
import { timeAgo } from "@/utility/timeAgo";
import { Icon } from "@iconify/react";
import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

const getCachedBlog = cache(async (slug) => getBlogBySlug(slug));

// Semrush flags titles over 70 chars; most blog titles are longer, so cut at a
// word boundary and only add the brand suffix when it still fits.
const SUFFIX = " | nyccleantinc";
const metaTitle = (title) => {
  if (title.length + SUFFIX.length <= 60) return title + SUFFIX;
  if (title.length <= 60) return title;
  const beforeColon = title.split(":")[0];
  if (beforeColon.length <= 60) return beforeColon;
  return title
    .slice(0, 60)
    .replace(/\s+\S*$/, "")
    .replace(/(\s+(and|or|of|a|an|the|to|for|in|on|what|how|why|vs))+$/i, "")
    .replace(/[\s,;-]+$/, "");
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getCachedBlog(slug);
  if (!blog) return {};
  return {
    title: metaTitle(blog.title),
    description: blog.shortDescription || blog.metaDescription,
    alternates: { canonical: `https://nyccleantinc.com/blogs/${slug}` },
  };
}
export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const [blog, blogLinks] = await Promise.all([
    getCachedBlog(slug),
    getBlogLinks(),
  ]);
  if (!blog) notFound();
  const moreBlogs = blogLinks.filter((b) => b.slug !== slug).slice(0, 5);
  return (
    <main>
      <section className="container my-8 sm:my-16">
        <div>
          <div className="relative">
            <Image
              src={`/api/uploads/blog/${blog.image}`}
              alt="blog"
              width={1920}
              height={1080}
              className="aspect-video w-full rounded-xl"
            />
            <div className="max-w-42 sm:max-w-40 h-12 px-2  md:h-21.5 bg-[#F78E8E] flex items-center justify-center text-center rounded-xl absolute bottom-0 right-0">
              <h6 className="heading-6 ">{GetTime(blog.createdAt)}</h6>
            </div>
          </div>
          <div className="mt-8 sm:mt-16">
            <h1 className="heading-2 capitalize">{blog?.title}</h1>
            <div
              className="mt-6 ql-editor body-text"
              dangerouslySetInnerHTML={{
                __html: blog?.content
                  // Some posts were pasted from the old local WordPress build and
                  // still link to http://localhost/wordpress/. Point those at the
                  // homepage so crawlers don't report broken external links.
                  .replace(
                    /href="https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?[^"]*"/gi,
                    'href="/"',
                  )
                  .replace(/&nbsp;/g, " ")
                  .replace(/<p><\/p>/g, ""),
              }}
            />
          </div>
          {blog.comments.length > 0 && (
            <div className="mt-8 sm:mt-16">
              <h2 className="heading-2">{blog.comments.length} Comments</h2>
              <div className="mt-10 space-y-6 body-text">
                {blog.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="max-w-180.5 flex flex-col sm:flex-row sm:items-start  gap-4 border-b pb-10"
                  >
                    <div className="bg-[#F78E8E] size-20 rounded-full flex items-center justify-center text-white">
                      <Icon
                        icon="clarity:avatar-solid"
                        width="50"
                        height="50"
                      />
                    </div>
                    <div className="flex-1">
                      <h6 className="heading-6 font-semibold capitalize">
                        {comment.name}
                      </h6>
                      <p className="text-sm sm:text-sm lg:text-[15px] font-light">
                        {timeAgo(comment.createdAt)}
                      </p>
                      <p className="font-light mt-1 text-base">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-16">
            <CommentForm blogId={blog._id} />
          </div>
        </div>
      </section>
      {moreBlogs.length > 0 && (
        <section className="container mb-10 sm:mb-16">
          <h2 className="text-slate text-2xl font-bold">More from our blog</h2>
          <ul className="mt-4 space-y-3">
            {moreBlogs.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/blogs/${b.slug}`}
                  className="text-light-blue hover:underline hover:text-blue-500"
                >
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
