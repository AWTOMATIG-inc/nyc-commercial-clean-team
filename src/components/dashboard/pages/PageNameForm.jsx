"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

export default function PageNameForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return setError("Page name is required");
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pages/page-name", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setName("");
        toast.success("Page Name created successfully!");
        router.push("/dashboard/pages");
      } else {
        toast.error(data?.error || "Page Name creation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-inter">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-jetbrains tracking-tight">
            Create Page Identifier Name
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add a new dynamic page category or route name identifier.
          </p>
        </div>

        <Link
          className="flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold transition-all shadow-2xs w-fit"
          href="/dashboard/pages"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          <span>Back to Pages</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Page Identifier Name <span className="text-[#ed0505]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 text-xs bg-white border ${
                error ? "border-rose-500 bg-rose-50/20" : "border-slate-300 hover:border-slate-400"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 placeholder:text-slate-400 font-medium transition-all shadow-2xs`}
              placeholder="e.g. Commercial Office Cleaning"
            />
            {error && (
              <p className="text-xs font-semibold text-rose-500 mt-1 pl-0.5">
                {error}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/pages"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs transition-all shadow-2xs"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Icon icon="lucide:plus-circle" className="w-4 h-4" />
              <span>{loading ? "Creating..." : "Create Page Name"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
