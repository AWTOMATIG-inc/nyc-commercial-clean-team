"use client";

import React from "react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  pageSize = 10,
  onPageChange,
}) {
  const startItem = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-slate-500 font-inter">
      <div>
        Showing <span className="font-semibold text-slate-900">{startItem}</span>-
        <span className="font-semibold text-slate-900">{endItem}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalResults}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all cursor-pointer"
        >
          Previous
        </button>

        {getPageNumbers().map((num) => {
          const isActive = num === currentPage;
          return (
            <button
              key={num}
              onClick={() => onPageChange && onPageChange(num)}
              className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all cursor-pointer flex items-center justify-center ${
                isActive
                  ? "bg-[#ed0505] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {num}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
