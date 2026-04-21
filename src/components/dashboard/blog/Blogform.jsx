"use client";
import Button from "@/components/Button";
import { blogYupSchema } from "@/yup/blogYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Editor = dynamic(() => import("@/components/dashboard/editor/Editor"), {
  ssr: false,
});

export default function BlogForm({ blog }) {
  const [loading, setLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const path = usePathname();
  const isEdit=path.includes("edit")
  const router=useRouter()

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: blog?.title || "",
      content: blog?.content || "",
      image:[],
    },
    resolver: yupResolver(blogYupSchema(isEdit)),
  });

  //for submitting the form
  const onSubmit = async (e) => {
    const formData = new FormData();
    formData.append("title", e.title);
    formData.append("content", e.content);
    if (e.image && e.image.length > 0) {
      formData.append("image", e.image[0]);
    }
    setLoading(true);

    if (isEdit) {     
        formData.append("existingImage", blog.image);
   
      try {
        const res = await fetch(`/api/blog/${blog?._id}`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();
        if (data) {
          reset({
            title: "",
            content: "",
            image: [],
          });
          setLoading(false);
          setIsRefresh(!isRefresh);
          toast.success("Blog updated successfully!");
          router.push("/dashboard")
        }
      } catch (error) {
        toast.error(error.message);
        console.error("Error updating blog:", error);
      }
    } else {
      try {
        const res = await fetch("/api/blog", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
            
        if (data) {
          reset();          
          setLoading(false);
          setIsRefresh(!isRefresh);
          toast.success("Blog created successfully!");

          
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="md:w-4/5 mx-auto">
      <div className="mt-10">
        <div className="flex justify-between mt-8">
          <h1 className="text-2xl font-bold">{isEdit?"Update":"Create"} new blog</h1>
          <Link
            className="bg-slate text-white px-4 py-2 rounded-xl"
            href="/dashboard/"
          >
            {" "}
            See Blogs
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-y-8 mt-8"
          action="#"
        >
          <div>
            <label htmlFor="" className="mb-1 block">
              Blog Title:
            </label>
            <input
              type="text"
              className="border border-gray-500 p-4 rounded-md w-full block"
              placeholder="Post Title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 ml-1 mt-1 block text-sm capitalize ">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-4 block">Description</label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Editor
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />

            {errors.content && (
              <span className="text-red-500 ml-1 mt-1 block text-sm capitalize">
                {errors.content.message}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="" className="mb-1 block">
              Blog Thumbnail Image:
            </label>
            <input
              type="file"
              className="border border-gray-500 p-4 rounded-md accent-amber-50 w-full block"
              {...register("image")}
            />
            {errors.image && (
              <p className="text-red-500 ml-1 mt-1 block text-sm capitalize">
                {errors.image.message}
              </p>
            )}
          </div>
          {isEdit ? (
            <Button
              name={loading ? "Updating..." : "Update"}
              className="bg-blue-600! text-white rounded-lg  w-fit ml-auto"
            />
          ) : (
            <Button
              name={loading ? "Publishing..." : "Publish"}
              className="bg-blue-600! text-white rounded-lg  w-fit ml-auto"
            />
          )}
        </form>
      </div>
    </div>
  );
}
