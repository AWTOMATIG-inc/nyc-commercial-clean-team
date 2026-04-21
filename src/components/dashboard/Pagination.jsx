"use client";

import Link from "next/link";

export default function Pagination({page,limit,total,totalPages}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <Link
        disabled={Number(page) === 1}
        href={`/dashboard/bookings?page=${Number(page) - 1}`}
        className="disabled:cursor-not-allowed px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </Link>

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;

        return (
          <Link
            key={pageNumber}
            href={`/dashboard/bookings?page=${Number(pageNumber)}`}
            className={`px-4 py-2 rounded ${
              page === pageNumber ? "bg-slate text-white" : "bg-gray-200"
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      <Link
        disabled={Number(page) === Number(totalPages)}
        href={`/dashboard/bookings?page=${Number(page) + 1}`}
        className="disabled:cursor-not-allowed px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </Link>
    </div>
  );
}
