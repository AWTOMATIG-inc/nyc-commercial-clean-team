import Image from "next/image";
import LinkWithArrow from "./LinkWithArrow";

export default function BlogCard({ blog, isClean }) {
  return (
    <div
      key={blog.id}
      className={`bg-skylight px-7 py-9   rounded-xl group ${isClean ? "" : "shadow-custom"}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <p className="font-semibold">{blog.title}</p>
          <h4 className="heading-4">{blog.heading}</h4>
          <p>{blog.desc}</p>
          <LinkWithArrow>learn more</LinkWithArrow>
        </div>
        {blog.overlayImage && (
          <Image
            src={blog.overlayImage}
            alt="overlay"
            width={82}
            height={82}
            className="max-w-20.5 w-full group-hover:-scale-x-100 "
          />
        )}
      </div>
      <div className="mt-4.5">
        <Image
          src={blog.image}
          alt={blog.title}
          width={474}
          height={316}
          className={`rounded-3xl object-cover ${isClean ? "w-full" : "max-w-92.75 mx-auto"}`}
        />
      </div>
    </div>
  );
}
