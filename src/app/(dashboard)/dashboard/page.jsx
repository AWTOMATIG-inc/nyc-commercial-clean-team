"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useAuth } from "@/hook/useAuth";
import MetricCard from "@/components/dashboard/ui/MetricCard";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import DataTable from "@/components/dashboard/ui/DataTable";
import BookingDrawer from "@/components/dashboard/ui/BookingDrawer";
import BookingTrendsChart from "@/components/dashboard/overview/BookingTrendsChart";
import RecentActivityFeed from "@/components/dashboard/overview/RecentActivityFeed";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingQuotes: 0,
    publishedArticles: 0,
    customerSatisfaction: "100%",
  });
  const [trends, setTrends] = useState({ office: [], industrial: [] });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Greeting helper based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Fetch real database stats & recent bookings
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);

        // 1. Fetch Stats, Trends & Activity Feed
        const statsRes = await fetch("/api/dashboard/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setStats(statsData.stats);
            setTrends(statsData.trends);
            setActivities(statsData.activities);
          }
        }

        // 2. Fetch Recent Bookings
        const bookingRes = await fetch("/api/booking?limit=5");
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          const items = Array.isArray(bookingData)
            ? bookingData
            : bookingData.data || [];
          setBookings(items);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Handle status update
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
      header: "Service Facility",
      accessor: "facilityType",
      cell: (row) => (
        <span className="capitalize text-slate-700 font-semibold">
          {row.facilityType || "Standard Clean"}
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
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBooking(row);
              setIsDrawerOpen(true);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            title="View Booking Details"
          >
            <Icon icon="lucide:eye" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 font-inter">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1d2f64] via-[#16244f] to-[#0f1938] p-6 md:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold font-jetbrains tracking-tight">
            {getGreeting()}, {user?.name || "Admin"}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl font-normal">
            Here's what's happening with NYC Clean Commercial Team operations today. Monitor scheduled dispatches, pending quotes, and team performance.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <Link
            href="/dashboard/bookings"
            className="px-4 py-2.5 rounded-xl bg-[#ed0505] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Icon icon="lucide:calendar-plus" className="w-4 h-4" />
            <span>Manage Bookings</span>
          </Link>
          <Link
            href="/dashboard/quotes"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-all border border-white/10 flex items-center gap-2"
          >
            <Icon icon="lucide:file-text" className="w-4 h-4" />
            <span>View Quotes</span>
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Prominent Action Banner for Pending Quotes */}
      {stats.pendingQuotes > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs">
              <Icon icon="lucide:bell" className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">
                Action Required: {stats.pendingQuotes} Pending Quote Request{stats.pendingQuotes > 1 ? "s" : ""}
              </p>
              <p className="text-[11px] text-amber-700">
                Potential clients are awaiting commercial cleaning proposals. Review quote details and respond.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/quotes"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Review Quotes</span>
            <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          badgeText="Active Operations"
          badgeType="success"
          icon="lucide:calendar-check"
          description="Total commercial dispatches recorded"
        />
        <MetricCard
          title="Pending Quotes"
          value={stats.pendingQuotes.toString()}
          badgeText={stats.pendingQuotes > 0 ? "Action Required" : "All Reviewed"}
          badgeType={stats.pendingQuotes > 0 ? "warning" : "success"}
          icon="lucide:file-text"
          description="Awaiting commercial proposals"
        />
        <MetricCard
          title="Published Articles"
          value={stats.publishedArticles.toString()}
          badgeText="Live Content"
          badgeType="info"
          icon="lucide:newspaper"
          description="SEO commercial articles online"
        />
        <MetricCard
          title="Customer Satisfaction"
          value={stats.customerSatisfaction}
          badgeText="Verified Ratings"
          badgeType="emerald"
          icon="lucide:star"
          description="Calculated from real client feedback"
        />
      </div>

      {/* Middle Grid: Trends & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <BookingTrendsChart
            officeData={trends.office}
            industrialData={trends.industrial}
          />
        </div>
        <div className="lg:col-span-4">
          <RecentActivityFeed activities={activities} />
        </div>
      </div>

      {/* Bottom Table: Recent Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 font-jetbrains tracking-tight">
              Recent Operational Bookings
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live commercial cleaning dispatches and client requests
            </p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>View All Bookings</span>
            <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={bookings}
          isLoading={isLoading}
          emptyMessage="No recent bookings available in database"
          onRowClick={(row) => {
            setSelectedBooking(row);
            setIsDrawerOpen(true);
          }}
        />
      </div>

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
