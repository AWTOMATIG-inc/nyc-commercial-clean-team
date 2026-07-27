"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { blogYupSchema } from "@/yup/blogYupSchema";

const Editor = dynamic(() => import("@/components/dashboard/editor/Editor"), {
  ssr: false,
});

export default function BlogForm({ blog }) {
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const isEdit = path.includes("edit");
  const router = useRouter();

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
      shortDescription: blog?.shortDescription || "",
      image: [],
    },
    resolver: yupResolver(blogYupSchema(isEdit)),
  });

  const shortDescriptionField = useWatch({
    control,
    name: "shortDescription",
  }) || "";

  const onSubmit = async (e) => {
    const formData = new FormData();
    formData.append("title", e.title);
    formData.append("content", e.content);
    formData.append("shortDescription", e.shortDescription);
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
        if (res.ok) {
          toast.success("Blog updated successfully!");
          router.push("/dashboard/blog");
        } else {
          toast.error(data?.error || "Update failed");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await fetch("/api/blog", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (res.ok) {
          reset();
          toast.success("Blog published successfully!");
          router.push("/dashboard/blog");
        } else {
          toast.error(data?.error || "Blog creation failed");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-inter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-jetbrains tracking-tight">
            {isEdit ? "Edit Article" : "Create New Article"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish SEO commercial cleaning guides and updates.
          </p>
        </div>

        <Link
          className="flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold transition-all shadow-2xs w-fit"
          href="/dashboard/blog"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Main Form Card Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Article Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Article Title <span className="text-[#ed0505]">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 text-xs bg-white border ${
                errors.title ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 placeholder:text-slate-400 font-semibold transition-all shadow-2xs`}
              placeholder="e.g., Commercial Office Sanitization Guidelines for NYC Buildings"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Short Excerpt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Short Description / Excerpt <span className="text-[#ed0505]">*</span>
            </label>
            <textarea
              placeholder="Brief summary for article cards and SEO meta description..."
              className={`w-full px-4 py-3 text-xs bg-white border ${
                errors.shortDescription ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 placeholder:text-slate-400 font-medium transition-all min-h-24 shadow-2xs`}
              {...register("shortDescription")}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.shortDescription ? (
                <p className="text-xs font-semibold text-rose-500 pl-0.5">
                  {errors.shortDescription.message}
                </p>
              ) : <span />}
              <span
                className={`text-[11px] font-mono ${
                  shortDescriptionField.length > 150 ? "text-rose-500 font-bold" : "text-slate-400"
                }`}
              >
                {shortDescriptionField.length} / 150
              </span>
            </div>
          </div>

          {/* Quill Rich Text Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Article Content & Body <span className="text-[#ed0505]">*</span>
            </label>
            <div className="bg-white rounded-xl border border-slate-300 hover:border-slate-400 overflow-hidden shadow-2xs">
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
            </div>
            {errors.content && (
              <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Featured Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Featured Image Thumbnail
            </label>
            <input
              type="file"
              accept="image/jpg, image/jpeg, image/png, image/webp"
              className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:outline-none focus:border-[#1d2f64] text-slate-700 cursor-pointer shadow-2xs"
              {...register("image")}
            />
            {errors.image && (
              <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/blog"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs transition-all shadow-2xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Icon icon={isEdit ? "lucide:save" : "lucide:send"} className="w-4 h-4" />
              <span>{loading ? "Processing..." : isEdit ? "Update Article" : "Publish Article"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
