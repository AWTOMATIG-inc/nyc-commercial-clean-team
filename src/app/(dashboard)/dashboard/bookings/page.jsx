"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import DataTable from "@/components/dashboard/ui/DataTable";
import Pagination from "@/components/dashboard/ui/Pagination";
import BookingDrawer from "@/components/dashboard/ui/BookingDrawer";

function BookingsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const pageSize = 10;

  // Fetch all bookings from API
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/booking?limit=100");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();

      const items = Array.isArray(data)
        ? data
        : data.data || [];

      setBookings(items);
    } catch (err) {
      console.error("Error loading bookings:", err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Sync initial query param if present
  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  // Status counts calculated from real fetched data
  const statusCounts = useMemo(() => {
    const counts = { all: bookings.length, pending: 0, confirmed: 0, cancelled: 0 };
    bookings.forEach((b) => {
      const st = String(b.status || "").toLowerCase().trim();
      if (st === "pending") counts.pending += 1;
      else if (st === "confirmed") counts.confirmed += 1;
      else if (st === "cancelled" || st === "cencelled") counts.cancelled += 1;
    });
    return counts;
  }, [bookings]);

  // Handle Delete
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toast.success("Booking deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Filtered & Paginated Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search query check
      const query = searchQuery.toLowerCase().trim();
      const name = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
      const company = (b.companyName || "").toLowerCase();
      const idStr = (b.bookingId || b._id || "").toLowerCase();
      const email = (b.email || "").toLowerCase();
      const matchesSearch =
        !query ||
        name.includes(query) ||
        company.includes(query) ||
        idStr.includes(query) ||
        email.includes(query);

      // Status check
      const st = String(b.status || "").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "cancelled" ? ["cancelled", "cencelled"].includes(st) : st === statusFilter);

      // Facility Type check
      const matchesType =
        typeFilter === "all" ||
        (b.facilityType || "").toLowerCase().includes(typeFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [bookings, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredBookings.length / pageSize) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  // Export CSV Helper
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      toast.error("No bookings to export");
      return;
    }
    const headers = ["Booking ID,Client Name,Company,Email,Phone,Service Type,Date,Status\n"];
    const rows = filteredBookings.map(
      (b) =>
        `"${b.bookingId || b._id}","${b.firstName || ""} ${b.lastName || ""}","${b.companyName || ""}","${b.email || ""}","${b.phone || ""}","${b.facilityType || ""}","${b.preferredStartDate || ""}","${b.status || ""}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NYC_Clean_Bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Bookings exported to CSV!");
  };

  const columns = [
    {
      header: "Booking ID",
      accessor: "bookingId",
      cell: (row) => (
        <span className="font-jetbrains font-bold text-slate-900">
          #{row.bookingId || row._id?.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      header: "Client & Company",
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-slate-500 font-medium">{row.companyName || "Personal Client"}</p>
        </div>
      ),
    },
    {
      header: "Facility Type",
      accessor: "facilityType",
      cell: (row) => (
        <span className="capitalize text-slate-700 font-semibold">
          {row.facilityType || "Standard Commercial"}
        </span>
      ),
    },
    {
      header: "Schedule Date",
      cell: (row) => (
        <span className="text-slate-600 font-medium">
          {row.preferredStartDate || "Flexible"}
        </span>
      ),
    },
    {
      header: "Location / Zip",
      accessor: "zipCode",
      cell: (row) => (
        <span className="text-slate-500 font-jetbrains text-xs">
          {row.area || "NYC"} ({row.zipCode || "10001"})
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedBooking(row);
              setIsDrawerOpen(true);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            title="View Details"
          >
            <Icon icon="lucide:eye" className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedBooking(row);
              setIsDrawerOpen(true);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
            title="Edit Booking Status"
          >
            <Icon icon="lucide:edit-3" className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Booking"
          >
            <Icon icon="lucide:trash-2" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Header Title & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-jetbrains tracking-tight">
            Booking Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor, filter, export and manage commercial cleaning dispatches and client requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs border border-slate-200 rounded-xl text-slate-700 bg-white hover:bg-slate-50 font-bold transition-all shadow-xs cursor-pointer"
          >
            <Icon icon="lucide:download" className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <Link
            href="/booking"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold transition-all shadow-xs cursor-pointer"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
        </div>
      </div>

      {/* Status Nav Tabs (All, Pending, Confirmed, Cancelled) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        {[
          { key: "all", label: "All Bookings", count: statusCounts.all },
          { key: "pending", label: "Pending", count: statusCounts.pending },
          { key: "confirmed", label: "Confirmed", count: statusCounts.confirmed },
          { key: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? "bg-[#1d2f64] text-white border-[#1d2f64] shadow-xs"
                  : "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar Filter Inputs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Icon
              icon="lucide:search"
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, client name, email, company..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/20 focus:border-[#1d2f64] text-slate-800 placeholder-slate-400 font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon icon="lucide:x" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Facility Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1d2f64] text-slate-700 font-semibold transition-all cursor-pointer"
          >
            <option value="all">Facility: All Types</option>
            <option value="office">Office Cleaning</option>
            <option value="medical">Medical Facility</option>
            <option value="industrial">Industrial / Warehouse</option>
            <option value="retail">Retail / Storefront</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
              className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={paginatedBookings}
        isLoading={isLoading}
        emptyMessage="No bookings matching selected criteria"
        onRowClick={(row) => {
          setSelectedBooking(row);
          setIsDrawerOpen(true);
        }}
      />

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={filteredBookings.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Slide-over Detail Drawer */}
      <BookingDrawer
        booking={selectedBooking}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

export default function BookingsManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading bookings...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
