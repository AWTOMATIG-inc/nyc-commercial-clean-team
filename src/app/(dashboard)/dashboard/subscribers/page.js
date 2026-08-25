"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import DataTable from "@/components/dashboard/ui/DataTable";
import Pagination from "@/components/dashboard/ui/Pagination";
import MetricCard from "@/components/dashboard/ui/MetricCard";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/subscriber");
      if (!response.ok) throw new Error("Failed to fetch subscribers");
      const data = await response.json();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const userConfirmed = confirm("Are you sure you want to delete this subscriber?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`/api/subscriber/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete subscriber");

      setSubscribers((prev) => prev.filter((item) => item._id !== id));
      toast.success("Subscriber deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }
    const headers = ["Index,Subscriber Email,Date Subscribed\n"];
    const rows = subscribers.map(
      (sub, idx) =>
        `"${idx + 1}","${sub.email}","${sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "N/A"}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NYC_Clean_Subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscribers exported to CSV!");
  };

  const filteredSubscribers = useMemo(() => {
    if (!searchQuery.trim()) return subscribers;
    const query = searchQuery.toLowerCase().trim();
    return subscribers.filter((s) => (s.email || "").toLowerCase().includes(query));
  }, [subscribers, searchQuery]);

  const totalPages = Math.ceil(filteredSubscribers.length / pageSize) || 1;
  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubscribers.slice(start, start + pageSize);
  }, [filteredSubscribers, currentPage, pageSize]);

  const columns = [
    {
      header: "SL #",
      cell: (row, idx) => (
        <span className="font-jetbrains font-bold text-slate-500 text-xs">
          #{(currentPage - 1) * pageSize + idx + 1}
        </span>
      ),
    },
    {
      header: "Subscribed Email",
      accessor: "email",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Icon icon="lucide:mail" className="w-4 h-4 text-slate-400" />
          <a
            href={`mailto:${row.email}`}
            className="font-bold text-blue-600 hover:underline"
          >
            {row.email}
          </a>
        </div>
      ),
    },
    {
      header: "Date Subscribed",
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
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Subscriber"
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
          Subscribers
        </h1>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 text-xs border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 font-bold transition-all shadow-xs cursor-pointer w-fit"
        >
          <Icon icon="lucide:download" className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Metric Card */}
      <div className="max-w-xs">
        <MetricCard
          title="Total Subscribers"
          value={subscribers.length.toString()}
          icon="lucide:mail"
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
            placeholder="Search email address..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/20 focus:border-[#1d2f64] text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedSubscribers}
        isLoading={isLoading}
        emptyMessage="No newsletter subscribers found"
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={filteredSubscribers.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
