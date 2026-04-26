"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function BlogPost() {
  const [blogs, setBlogs] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [editBlog, setEditBlog] = useState({
    id: "",
    existingImage: "",
  });

  //for fetching blogs
  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/blog");
      if (!res.ok) {
        throw new Error("something went wrong");
      }
      const data = await res.json();
      setBlogs(data);
    }
    fetchData();
  }, [isRefresh]);
  //for deleting a blog
  const handleDelete = async (id) => {
    const userConfirmed = confirm("Are you sure you want to delete this item?");
    if (!userConfirmed) return;
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("There was a problem with the delete operation:", error);
      toast.error(error.message);
    }
  };

  const handleEdit = (blog) => {
    setIsEdit(true);
    setEditBlog({
      id: blog._id,
      existingImage: blog.image,
    });
    reset({
      title: blog.title,
      content: blog.content,
      image: [],
    });
    window.scrollTo(0, 0, { behavior: "smooth" });
  };
  return (
    <div className="md:w-4/5 mx-auto">
      <div className="flex justify-between mt-8">
        <h1 className="text-2xl font-bold">Blog list</h1>
        <Link
          className="bg-slate text-white px-4 py-2 rounded-xl"
          href="/dashboard/blog/create"
        >
          {" "}
          Create new Blog
        </Link>
      </div>
      <div className="mt-20">
        {blogs.length === 0 && (
          <div className="w-fit mx-auto text-center">
            <Image
              src="/images/dashboard/empty.png"
              width={400}
              height={400}
              alt="empty"
            />
            <p className="text-gray-500 text-xl mt-8 font-inter">
              There is no blog yet!
            </p>
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-3 ">
          {blogs?.map((blog) => (
            <div key={blog._id} className="custom-shadow p-4 rounded-md ">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold  py-1">{blog.title}</h5>
                <div className="flex gap-2 items-center">
                  <Link href={`/dashboard/blog/edit/${blog.slug}`} className="relative top-0.5">
                    <button className="cursor-pointer hover:text-blue-500 hover:border-blue-500">
                      <Icon
                        icon="fluent:edit-24-regular"
                        width="20"
                        height="20"
                      />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="cursor-pointer hover:text-red-500 hover:border-red-500"
                  >
                    <Icon
                      icon="mingcute:delete-2-line"
                      width="20"
                      height="20"
                    />
                  </button>
                </div>
              </div>

              <Image
                src={`/api/uploads/blog/${blog.image}`}
                width={500}
                height={200}
                alt="post"
                className="rounded-md object-cover w-full h-50"
              />
              <div
                className="my-2 wrap-break-word"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
