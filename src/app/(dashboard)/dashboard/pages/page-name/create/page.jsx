"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import PageNameForm from "@/components/dashboard/pages/PageNameForm";
import DataTable from "@/components/dashboard/ui/DataTable";
import Pagination from "@/components/dashboard/ui/Pagination";

export default function PageNameCreate() {
  const [pageNames, setPageNames] = useState([]);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const limit = 10;

  const fetchPageNames = async (currentPage) => {
    try {
      const res = await fetch(
        `/api/pages/page-name?page=${currentPage}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch page names");
      const result = await res.json();
      if (result.success) {
        setPageNames(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalItems(result.pagination?.total || (result.data || []).length);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    const userConfirmed = confirm("Are you sure you want to delete this page name identifier?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`/api/pages/page-name/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete page name");

      setIsRefresh((prev) => !prev);
      toast.success("Page Name deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchPageNames(page);
    });
  }, [page, isRefresh]);

  const columns = [
    {
      header: "ID",
      accessor: "_id",
      cell: (row) => (
        <span className="font-jetbrains font-bold text-slate-900">
          #NYC-{row._id?.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Identifier Name",
      accessor: "name",
      cell: (row) => (
        <span className="font-bold text-slate-900 capitalize">
          {row.name}
        </span>
      ),
    },
    {
      header: "Slug / Route",
      accessor: "slug",
      cell: (row) => (
        <span className="font-mono text-xs text-slate-600 font-medium">
          {row.slug}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          title="Delete Page Name"
        >
          <Icon icon="lucide:trash-2" className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-inter">
      {/* Create Form */}
      <PageNameForm />

      {/* Page Name Table List */}
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-xl font-bold text-slate-900 font-jetbrains tracking-tight">
          Existing Page Name Identifiers
        </h2>

        <DataTable
          columns={columns}
          data={pageNames}
          isLoading={isPending}
          emptyMessage="No page name identifiers created yet"
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalResults={totalItems}
          pageSize={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}
