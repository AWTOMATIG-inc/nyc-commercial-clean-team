"use client";

import React from "react";
import { Icon } from "@iconify/react";

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = "No data available",
  onRowClick,
}) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 p-6 overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-100 rounded-lg w-full" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`py-3.5 px-4 font-semibold ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-400 font-medium"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Icon icon="lucide:inbox" className="w-10 h-10 text-slate-300" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row._id || row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group hover:bg-slate-50/80 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || colIndex}
                      className={`py-4 px-4 align-middle ${col.className || ""}`}
                    >
                      {col.cell ? col.cell(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
