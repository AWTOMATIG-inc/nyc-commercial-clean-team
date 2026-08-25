"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { GetTime } from "@/utility/GetTime";

export default function FeedbackModal({ feedback, isOpen, onClose, onDelete }) {
  if (!isOpen || !feedback) return null;

  const ratingStars = Array.from({ length: 5 }, (_, i) => i < (feedback.rating || 5));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 font-inter animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-xs">
              {feedback.image ? (
                <Image
                  src={`/api/uploads/feedback/${feedback.image}`}
                  alt={feedback.clientName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Icon icon="lucide:user" className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-jetbrains">
                {feedback.clientName || "Anonymous Client"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {GetTime(feedback.feedbackDate || feedback.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
            aria-label="Close"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Star Rating Display */}
          <div className="flex items-center justify-between bg-amber-50/60 border border-amber-100 p-3.5 rounded-2xl">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Client Rating Score:
            </span>
            <div className="flex items-center gap-1">
              {ratingStars.map((isFilled, idx) => (
                <Icon
                  key={idx}
                  icon="lucide:star"
                  className={`w-5 h-5 ${
                    isFilled ? "text-amber-500 fill-amber-500" : "text-slate-300"
                  }`}
                />
              ))}
              <span className="ml-1.5 font-jetbrains font-extrabold text-amber-900 text-sm">
                {feedback.rating || 5}.0
              </span>
            </div>
          </div>

          {/* Feedback Body */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Testimonial & Review Content
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-800 text-sm leading-relaxed italic">
              "{feedback.feedback}"
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3">
          {onDelete && (
            <button
              onClick={() => {
                onDelete(feedback._id);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
              <span>Delete Feedback</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
