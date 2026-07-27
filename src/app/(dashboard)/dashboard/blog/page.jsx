"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import DataTable from "@/components/dashboard/ui/DataTable";
import Pagination from "@/components/dashboard/ui/Pagination";
import MetricCard from "@/components/dashboard/ui/MetricCard";

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/blog");
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading blog articles:", err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const userConfirmed = confirm("Are you sure you want to delete this blog article?");
    if (!userConfirmed) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete article");

      setBlogs((prev) => prev.filter((b) => b._id !== id));
      toast.success("Blog article deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    const query = searchQuery.toLowerCase().trim();
    return blogs.filter((b) => {
      const title = (b.title || "").toLowerCase();
      const desc = (b.shortDescription || "").toLowerCase();
      return title.includes(query) || desc.includes(query);
    });
  }, [blogs, searchQuery]);

  const totalPages = Math.ceil(filteredBlogs.length / pageSize) || 1;
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBlogs.slice(start, start + pageSize);
  }, [filteredBlogs, currentPage, pageSize]);

  const columns = [
    {
      header: "Article",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
            {row.image ? (
              <Image
                src={`/api/uploads/blog/${row.image}`}
                alt={row.title}
                width={56}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                <Icon icon="lucide:image" className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="min-w-0 max-w-md">
            <h4 className="font-bold text-slate-900 text-sm truncate leading-tight">
              {row.title}
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1 font-medium">
              {row.shortDescription}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "URL Path",
      accessor: "slug",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-600 font-medium">
          /blogs/{row.slug}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="text-xs text-slate-500 font-medium">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "Recent"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/blogs/${row.slug}`}
            target="_blank"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
            title="View Live Article"
          >
            <Icon icon="lucide:external-link" className="w-4 h-4" />
          </Link>
          <Link
            href={`/dashboard/blog/edit/${row.slug}`}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Edit Article"
          >
            <Icon icon="lucide:edit-3" className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Article"
          >
            <Icon icon="lucide:trash-2" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 font-jetbrains tracking-tight">
          Blogs & Articles
        </h1>

        <Link
          href="/dashboard/blog/create"
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold transition-all shadow-xs cursor-pointer w-fit"
        >
          <Icon icon="lucide:pen-tool" className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* Total Articles Count Card */}
      <div className="max-w-xs">
        <MetricCard
          title="Total Published Articles"
          value={blogs.length.toString()}
          icon="lucide:newspaper"
          badgeType="info"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Icon
            icon="lucide:search"
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title or description..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/20 focus:border-[#1d2f64] text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Table View"
          >
            <Icon icon="lucide:list" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Grid View"
          >
            <Icon icon="lucide:grid" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <DataTable
          columns={columns}
          data={paginatedBlogs}
          isLoading={isLoading}
          emptyMessage="No blog articles found"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBlogs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs font-medium">
              No blog articles matching search
            </div>
          ) : (
            paginatedBlogs.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    {b.image ? (
                      <Image
                        src={`/api/uploads/blog/${b.image}`}
                        alt={b.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Icon icon="lucide:image" className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-400">
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "Recent"}
                    </p>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {b.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/blogs/${b.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>Preview</span>
                    <Icon icon="lucide:external-link" className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/blog/edit/${b.slug}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Icon icon="lucide:edit-3" className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(b._id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Icon icon="lucide:trash-2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={filteredBlogs.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
