"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { feedbackYupSchema } from "@/yup/feedbackYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

export default function FeedbackForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    reset,
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientName: "",
      feedbackDate: "",
      rating: "5",
      feedback: "",
      image: null,
    },
    resolver: yupResolver(feedbackYupSchema),
  });

  const feedbackField = useWatch({
    control,
    name: "feedback",
  }) || "";

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("clientName", data.clientName);
    formData.append("feedbackDate", data.feedbackDate);
    formData.append("rating", data.rating);
    formData.append("feedback", data.feedback);
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });
      const feedbackData = await res.json();
      if (res.ok) {
        reset();
        toast.success("Feedback added successfully!");
        router.push("/dashboard/client-feedback");
      } else {
        toast.error(feedbackData?.error || "Failed to create feedback");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-inter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-jetbrains tracking-tight">
            Create Client Feedback
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add a new verified testimonial entry and client rating.
          </p>
        </div>

        <Link
          href="/dashboard/client-feedback"
          className="flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold transition-all shadow-2xs w-fit"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          <span>Back to Feedback</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Client Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Client Name <span className="text-[#ed0505]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                className={`w-full px-4 py-3 text-xs bg-white border ${
                  errors.clientName ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-2xs`}
                {...register("clientName")}
              />
              {errors.clientName && (
                <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            {/* Client Profile Photo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Client Profile Photo
              </label>
              <input
                type="file"
                accept="image/jpg, image/jpeg, image/png, image/webp"
                className={`w-full px-4 py-2.5 text-xs bg-white border ${
                  errors.image ? "border-rose-500" : "border-slate-300 hover:border-slate-400"
                } rounded-xl focus:outline-none focus:border-[#1d2f64] text-slate-700 cursor-pointer shadow-2xs`}
                {...register("image")}
              />
              {errors.image && (
                <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Rating Score (Stars) <span className="text-[#ed0505]">*</span>
              </label>
              <select
                {...register("rating")}
                className="w-full px-4 py-3 text-xs bg-white border border-slate-300 hover:border-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 font-bold transition-all cursor-pointer shadow-2xs"
              >
                <option value="5">5 Stars (Excellent)</option>
                <option value="4">4 Stars (Good)</option>
                <option value="3">3 Stars (Average)</option>
                <option value="2">2 Stars (Poor)</option>
                <option value="1">1 Star (Very Poor)</option>
              </select>
              {errors.rating && (
                <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* Feedback Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Feedback Date & Time
              </label>
              <input
                type="datetime-local"
                className={`w-full px-4 py-2.5 text-xs bg-white border ${
                  errors.feedbackDate ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 font-medium transition-all shadow-2xs`}
                {...register("feedbackDate")}
              />
              {errors.feedbackDate && (
                <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                  {errors.feedbackDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Feedback Testimonial Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Feedback Testimonial Content <span className="text-[#ed0505]">*</span>
            </label>
            <textarea
              placeholder="Enter client testimonial or feedback details..."
              className={`w-full px-4 py-3 text-xs bg-white border ${
                errors.feedback ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 placeholder:text-slate-400 font-medium transition-all min-h-28 shadow-2xs`}
              {...register("feedback")}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.feedback ? (
                <p className="text-xs font-semibold text-rose-500 pl-0.5">
                  {errors.feedback.message}
                </p>
              ) : <span />}
              <span
                className={`text-[11px] font-mono ${
                  feedbackField.length > 255 ? "text-rose-500 font-bold" : "text-slate-400"
                }`}
              >
                {feedbackField.length} / 255
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/client-feedback"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs transition-all shadow-2xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Icon icon="lucide:check-circle-2" className="w-4 h-4" />
              <span>{loading ? "Submitting..." : "Submit Feedback"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
