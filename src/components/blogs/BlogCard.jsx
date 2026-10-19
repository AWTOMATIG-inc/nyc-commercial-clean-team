import Image from "next/image";
import LinkWithArrow from "../LinkWithArrow";

export default function BlogCard({ blog }) {
  return (
    <div
      key={blog._id}
      className={`min-h-128 mx-1 my-1 bg-white shadow-sm shadow-black/30 rounded-xl group `}
    >
      <div className=" overflow-hidden rounded-xl">
        <Image
          src={`/api/uploads/blog/${blog.image}`}
          alt={blog.title}
          width={500}
          height={395}
          className={`aspect-video w-full group-hover:scale-110 transition-all duration-300 h-66`}
        />
      </div>
      <div className="flex items-start justify-between px-7 py-9 ">
        <div className="space-y-4">
          <p className="font-semibold capitalize">{blog.title}</p>
          <h5 className="heading-5 whitespace-pre-line">{blog.heading}</h5>
          <div className="text-justify">
            <p>{blog.shortDescription} ...</p>
          </div>
          <LinkWithArrow href={`/blogs/${blog.slug}`}>Read more</LinkWithArrow>
        </div>
      </div>
    </div>
  );
}
