"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LinkWithArrow from "../LinkWithArrow";
import { truncateHTML } from "../dashboard/editor/TruncateHTML";

export default function BlogCard({ blog }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const result = truncateHTML(blog?.content, 17);
    setHtml(result?.htmlText || "");
  }, [blog.content]);
  return (
    <div
      key={blog._id}
      className={`min-h-128 mx-1 my-1 bg-white shadow-sm shadow-black/30 rounded-xl group `}
    >
      <div className=" overflow-hidden rounded-xl">
        <Image
          src={`/api/uploads/blog/${blog.image}`}
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
          <div
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: html,
            }}
          />
          <LinkWithArrow href={`/blogs/${blog.slug}`}>Read more</LinkWithArrow>
        </div>
      </div>
    </div>
  );
}
