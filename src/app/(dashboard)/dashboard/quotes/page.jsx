"use client";

import React, { useEffect, useState, useTransition, useMemo } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import DataTable from "@/components/dashboard/ui/DataTable";
import Pagination from "@/components/dashboard/ui/Pagination";
import QuoteDrawer from "@/components/dashboard/ui/QuoteDrawer";

export default function QuotesManagementPage() {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [statusVal, setStatusVal] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefresh, setIsRefresh] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const limit = 10;

  const fetchQuotes = async (currentPage, currentStatusVal) => {
    try {
      const res = await fetch(
        `/api/quote?page=${currentPage}&limit=${limit}&status=${currentStatusVal}`
      );
      if (!res.ok) throw new Error("Failed to fetch quotes");
      const result = await res.json();
      if (result.success) {
        setQuotes(result.data || []);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalQuotes(result.pagination?.total || (result.data || []).length);
      }
    } catch (err) {
      console.error("Error loading quotes:", err);
      toast.error(err.message);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const userConfirmed = confirm("Are you sure you want to delete this quote request?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`/api/quote/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete quote");

      setIsRefresh(!isRefresh);
      toast.success("Quote request deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchQuotes(page, statusVal);
    });
  }, [page, statusVal, isRefresh]);

  // Client-side search filtering on loaded quotes page
  const filteredQuotes = useMemo(() => {
    if (!searchQuery.trim()) return quotes;
    const query = searchQuery.toLowerCase().trim();
    return quotes.filter((q) => {
      const name = (q.fullName || "").toLowerCase();
      const email = (q.email || "").toLowerCase();
      const company = (q.companyName || "").toLowerCase();
      const idStr = (q._id || "").toLowerCase();
      return (
        name.includes(query) ||
        email.includes(query) ||
        company.includes(query) ||
        idStr.includes(query)
      );
    });
  }, [quotes, searchQuery]);

  const columns = [
    {
      header: "Quote ID",
      accessor: "_id",
      cell: (row) => (
        <span className="font-jetbrains font-bold text-slate-900">
          #NYC-{row._id?.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Client & Email",
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900 capitalize">
            {row.fullName || "Commercial Client"}
          </p>
          <p className="text-xs text-blue-600 font-medium">{row.email}</p>
        </div>
      ),
    },
    {
      header: "Phone Number",
      accessor: "phone",
      cell: (row) => (
        <span className="text-slate-700 font-medium font-jetbrains text-xs">
          {row.phone || "N/A"}
        </span>
      ),
    },
    {
      header: "Facility Type",
      accessor: "facilityType",
      cell: (row) => (
        <span className="capitalize text-slate-700 font-semibold">
          {row.facilityType || "Commercial"}
        </span>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      cell: (row) => (
        <span className="capitalize text-slate-600 font-medium">
          {row.category || "General Clean"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status || "pending"} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedQuote(row);
              setIsDrawerOpen(true);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            title="View Quote Details"
          >
            <Icon icon="lucide:eye" className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Quote Request"
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
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-jetbrains tracking-tight">
            Quote Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage incoming commercial cleaning quotes, proposals, and client requests.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        {[
          { key: "all", label: "All Quotes" },
          { key: "pending", label: "Pending Review" },
          { key: "reviewed", label: "Reviewed" },
          { key: "approved", label: "Approved" },
        ].map((tab) => {
          const isActive = statusVal === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setStatusVal(tab.key);
                setPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#1d2f64] text-white border-[#1d2f64] shadow-xs"
                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toolbar Bar */}
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
            placeholder="Search by client name, email, or quote ID..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/20 focus:border-[#1d2f64] text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredQuotes}
        isLoading={isPending}
        emptyMessage="No quote requests found"
        onRowClick={(row) => {
          setSelectedQuote(row);
          setIsDrawerOpen(true);
        }}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalQuotes}
        pageSize={limit}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Quote Detail Drawer */}
      <QuoteDrawer
        quote={selectedQuote}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDelete={(id) => handleDelete(id)}
      />
    </div>
  );
}
