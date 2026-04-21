import CommentForm from "@/components/blogs/CommentForm";
import { blogs } from "@/constant/blogs/blogs";
import { getBlogBySlug } from "@/utility/getBlogs";
import { GetTime } from "@/utility/GetTime";
import Image from "next/image";
export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug)
  return (
    <main>
     
      <section className="container my-8 sm:my-16">
        <div>
          <div className="relative">
            <Image
              src={`/api/uploads/blog/${blog.image}`}
              alt="blog"
              width={1252}
              height={538}
              className="h-85 md:h-134 w-full object-cover rounded-xl"
            />
            <div className="max-w-40 h-12  md:h-21.5 bg-[#F78E8E] flex items-center justify-center text-center rounded-xl absolute bottom-0 right-0">
              <h6 className="heading-6">{GetTime(blog.createdAt)}</h6>
            </div>
          </div>
          <div className="mt-8 sm:mt-16">
            <h1 className="heading-2">{blog?.title}</h1>
            <div className="mt-6 body-text" dangerouslySetInnerHTML={{__html:blog?.content}}/>
              
            
          </div>
          <div className="mt-8 sm:mt-16">
            <h1 className="heading-2">02 Comments</h1>
            <div className="mt-10 space-y-6 body-text">
              {
                blogs[0].comments.map(comment=><div key={comment.id} className="max-w-180.5 flex flex-col sm:flex-row sm:items-center  gap-4 border-b pb-10">
                    <div className="">
                        <Image src={comment.avatar} alt="avatar" width={86} height={86} className="size-16 md:size-21.5 object-cover"/>
                    </div>
                    <div className="flex-1">
                        <h6 className="heading-6 font-semibold">{comment.name}</h6>
                        <p className="font-light mt-1 text-base">{comment.review}</p>
                    </div>
                </div>)
              }
            </div>
          </div>
          <div className="mt-8 sm:mt-16">
            <CommentForm/>
          </div>
          
        </div>
      </section>
    </main>
  );
}
