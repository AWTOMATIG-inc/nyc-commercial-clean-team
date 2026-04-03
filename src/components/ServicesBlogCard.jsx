import Image from "next/image";
import LinkWithArrow from "./LinkWithArrow";

export default function ServicesBlogCard({ blog, view = "col" }) {
  if (view == "row") {
    return (
      <div
        key={blog.id}
        className={`h-110 mx-1 my-1 bg-white shadow-sm shadow-black/30 rounded-xl group flex flex-col lg:flex-row justify-between`}
      >
        
        <div className="flex items-center justify-between px-7 py-9 basis-[55%]">
          <div className="space-y-4">
            <p className="font-semibold">{blog.title}</p>
            <h5 className="heading-5">{blog.heading}</h5>
            <p className="text-justify">{blog.desc}</p>
            <LinkWithArrow href={`/blogs/${blog.id}`}>learn more</LinkWithArrow>
          </div>
        </div>
        <div className=" overflow-hidden rounded-xl basis-[60%]">
          <Image
            src={blog.image}
            alt={blog.title}
            width={395}
            height={263}
            className={`object-cover w-full group-hover:scale-110 transition-all duration-300  h-full`}
          />
        </div>
      </div>
    );
  }
  if (view == "row-reverse") {
    return (
      <div
        key={blog.id}
        className={` bg-white shadow-sm shadow-black/30 rounded-xl group flex flex-col justify-between`}
      >
        
        <div className="flex items-start justify-between px-7 py-9 ">
          <div className="space-y-4">
            <p className="font-semibold">{blog.title}</p>
            <h5 className="heading-5">{blog.heading}</h5>
            <p className="text-justify">{blog.desc}</p>
            <LinkWithArrow href={`/blogs/${blog.id}`}>learn more</LinkWithArrow>
          </div>
        </div>
        <div className=" overflow-hidden rounded-xl">
          <Image
            src={blog.image}
            alt={blog.title}
            width={395}
            height={263}
            className={`object-cover w-full group-hover:scale-110 transition-all duration-300 h-43`}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      key={blog.id}
      className={`min-h-128 mx-1 my-1 bg-white shadow-sm shadow-black/30 rounded-xl group `}
    >
      <div className=" overflow-hidden rounded-xl">
        <Image
          src={blog.image}
          alt={blog.title}
          width={395}
          height={263}
          className={`object-cover w-full group-hover:scale-110 transition-all duration-300 h-66`}
        />
      </div>
      <div className="flex items-start justify-between px-7 py-9 ">
        <div className="space-y-4">
          <p className="font-semibold">{blog.title}</p>
          <h5 className="heading-5 whitespace-pre-line">{blog.heading}</h5>
          <p className="text-justify">{blog.desc}</p>
          <LinkWithArrow href={`/blogs/${blog.id}`}>learn more</LinkWithArrow>
        </div>
      </div>
    </div>
  );
}
