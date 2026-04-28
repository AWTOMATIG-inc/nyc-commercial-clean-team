import CommentForm from "@/components/blogs/CommentForm";
import { getBlogBySlug } from "@/utility/getBlogs";
import { GetTime } from "@/utility/GetTime";
import { timeAgo } from "@/utility/timeAgo";
import { Icon } from "@iconify/react";
import Image from "next/image";
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  return {
    title: `Blogs - ${blog.title} |`,
    description: blog.shortDescription || blog.metaDescription,
  };
}
export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
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
              className="mt-6 body-text wrap-break-word"
              dangerouslySetInnerHTML={{
                __html: blog?.content.replace(/&nbsp;/g, " "),
              }}
            />
          </div>
          {blog.comments.length > 0 && (
            <div className="mt-8 sm:mt-16">
              <h1 className="heading-2">{blog.comments.length} Comments</h1>
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
    </main>
  );
}
