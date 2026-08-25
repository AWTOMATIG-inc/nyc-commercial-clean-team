"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { GetTime } from "@/utility/GetTime";
import MetricCard from "@/components/dashboard/ui/MetricCard";
import DataTable from "@/components/dashboard/ui/DataTable";
import Pagination from "@/components/dashboard/ui/Pagination";
import FeedbackModal from "@/components/dashboard/ui/FeedbackModal";

export default function ClientFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pageSize = 10;

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/feedback");
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading feedback:", err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const userConfirmed = confirm("Are you sure you want to delete this feedback item?");
    if (!userConfirmed) return;

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete feedback");

      setFeedbacks((prev) => prev.filter((item) => item._id !== id));
      toast.success("Feedback deleted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Feedback Metrics Calculation
  const feedbackMetrics = useMemo(() => {
    if (feedbacks.length === 0) {
      return { total: 0, avgRating: "5.0", fiveStars: 0 };
    }
    const total = feedbacks.length;
    const sum = feedbacks.reduce((acc, curr) => acc + Number(curr.rating || 5), 0);
    const avgRating = (sum / total).toFixed(1);
    const fiveStars = feedbacks.filter((f) => Number(f.rating) === 5).length;
    return { total, avgRating, fiveStars };
  }, [feedbacks]);

  // Filtered & Paginated Feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      const query = searchQuery.toLowerCase().trim();
      const name = (f.clientName || "").toLowerCase();
      const content = (f.feedback || "").toLowerCase();
      const matchesSearch = !query || name.includes(query) || content.includes(query);

      const rating = Number(f.rating || 5);
      const matchesRating =
        ratingFilter === "all" || rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [feedbacks, searchQuery, ratingFilter]);

  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize) || 1;
  const paginatedFeedbacks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredFeedbacks.slice(start, start + pageSize);
  }, [filteredFeedbacks, currentPage, pageSize]);

  const columns = [
    {
      header: "Client Profile",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
            {row.image ? (
              <Image
                src={`/api/uploads/feedback/${row.image}`}
                alt={row.clientName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon icon="lucide:user" className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 capitalize">
              {row.clientName || "Anonymous Client"}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {GetTime(row.feedbackDate || row.createdAt)}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Rating",
      accessor: "rating",
      cell: (row) => {
        const rating = Number(row.rating || 5);
        return (
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80 w-fit">
            <Icon icon="lucide:star" className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-jetbrains font-extrabold text-amber-900 text-xs">
              {rating}.0
            </span>
          </div>
        );
      },
    },
    {
      header: "Feedback Content Excerpt",
      accessor: "feedback",
      cell: (row) => (
        <p className="text-slate-600 text-xs line-clamp-2 max-w-md italic">
          "{row.feedback}"
        </p>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedFeedback(row);
              setIsModalOpen(true);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            title="Read Full Feedback"
          >
            <Icon icon="lucide:eye" className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete Feedback"
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
            Client Feedback & Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor client satisfaction ratings, commercial testimonials, and feedback entries.
          </p>
        </div>

        <Link
          href="/dashboard/client-feedback/create"
          className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-bold transition-all shadow-xs cursor-pointer w-fit"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" />
          <span>Create New Feedback</span>
        </Link>
      </div>

      {/* Metric Cards Top Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <MetricCard
          title="Total Feedback Entries"
          value={feedbackMetrics.total.toString()}
          badgeText="Verified Reviews"
          badgeType="info"
          icon="lucide:message-square"
          description="Total client reviews recorded"
        />
        <MetricCard
          title="Average Rating Score"
          value={`${feedbackMetrics.avgRating} / 5.0`}
          badgeText="Satisfaction Index"
          badgeType="emerald"
          icon="lucide:star"
          description="Overall client rating score"
        />
        <MetricCard
          title="5-Star Reviews"
          value={feedbackMetrics.fiveStars.toString()}
          badgeText={`${feedbackMetrics.total ? Math.round((feedbackMetrics.fiveStars / feedbackMetrics.total) * 100) : 100}% Top Rated`}
          badgeType="success"
          icon="lucide:award"
          description="Perfect satisfaction testimonials"
        />
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Icon
            icon="lucide:search"
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search feedback content or client name..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/20 focus:border-[#1d2f64] text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>

        {/* Rating Filter Dropdown */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1d2f64] text-slate-700 font-semibold transition-all cursor-pointer w-full sm:w-auto"
        >
          <option value="all">Rating: All Stars</option>
          <option value="5">5 Star Reviews Only</option>
          <option value="4">4 Star Reviews</option>
          <option value="3">3 Star Reviews</option>
        </select>
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={paginatedFeedbacks}
        isLoading={isLoading}
        emptyMessage="No client feedback entries found"
        onRowClick={(row) => {
          setSelectedFeedback(row);
          setIsModalOpen(true);
        }}
      />

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={filteredFeedbacks.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Feedback Modal Detail View */}
      <FeedbackModal
        feedback={selectedFeedback}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={(id) => handleDelete(id)}
      />
    </div>
  );
}
