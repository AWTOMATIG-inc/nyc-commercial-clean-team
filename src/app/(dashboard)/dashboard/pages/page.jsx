"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import DataTable from "@/components/dashboard/ui/DataTable";
import Pagination from "@/components/dashboard/ui/Pagination";
import MetricCard from "@/components/dashboard/ui/MetricCard";

export default function PagesManagementPage() {
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [statusVal, setStatusVal] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const limit = 10;

  const fetchPages = async (currentPage, currentStatusVal) => {
    try {
      const res = await fetch(
        `/api/pages?page=${currentPage}&limit=${limit}&status=${currentStatusVal}`
      );
      if (!res.ok) throw new Error("Failed to fetch dynamic pages");
      const result = await res.json();
      if (result.success) {
        setPages(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalItems(result.pagination?.total || (result.data || []).length);
      }
    } catch (err) {
      console.error("Error loading dynamic pages:", err);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const userConfirmed = confirm("Are you sure you want to delete this page entry?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete page");

      setIsRefresh(!isRefresh);
      toast.success("Page deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchPages(page, statusVal);
    });
  }, [page, statusVal, isRefresh]);

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return pages;
    const query = searchQuery.toLowerCase().trim();
    return pages.filter((p) => {
      const name = (p.pageName || "").toLowerCase();
      const title = (p.title || "").toLowerCase();
      const idStr = (p._id || "").toLowerCase();
      return name.includes(query) || title.includes(query) || idStr.includes(query);
    });
  }, [pages, searchQuery]);

  const columns = [
    {
      header: "Page ID",
      accessor: "_id",
      cell: (row) => (
        <span className="font-jetbrains font-bold text-slate-900">
          #NYC-{row._id?.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Page Name",
      accessor: "pageName",
      cell: (row) => (
        <span className="font-bold text-slate-900 capitalize">
          {row.pageName || "Custom Page"}
        </span>
      ),
    },
    {
      header: "Title",
      accessor: "title",
      cell: (row) => (
        <span className="text-slate-700 font-medium line-clamp-1 max-w-sm">
          {row.title || "Untitled Page"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Link
            href={`/dashboard/pages/edit/${row._id}`}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            title="Edit Page"
          >
            <Icon icon="lucide:edit-3" className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Page"
          >
            <Icon icon="lucide:trash-2" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 font-jetbrains tracking-tight">
          Dynamic Pages
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-bold transition-all shadow-xs"
            href="/dashboard/pages/page-name/create"
          >
            Create Page Name
          </Link>
          <Link
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold transition-all shadow-xs cursor-pointer"
            href="/dashboard/pages/create"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span>Create Page</span>
          </Link>
        </div>
      </div>

      {/* Total Dynamic Pages Count Card */}
      <div className="max-w-xs">
        <MetricCard
          title="Total Dynamic Pages"
          value={totalItems.toString()}
          icon="lucide:layers"
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
            placeholder="Search page name, title, or ID..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/20 focus:border-[#1d2f64] text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredPages}
        isLoading={isPending}
        emptyMessage="No dynamic pages found"
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalItems}
        pageSize={limit}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
