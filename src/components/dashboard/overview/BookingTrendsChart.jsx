"use client";

import React from "react";

export default function BookingTrendsChart({ officeData = [], industrialData = [] }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Default fallback data if database is empty
  const office = officeData.length === 12 ? officeData : [14, 18, 22, 19, 25, 28, 32, 30, 35, 40, 38, 42];
  const industrial = industrialData.length === 12 ? industrialData : [8, 10, 14, 12, 15, 18, 20, 22, 21, 25, 24, 28];

  // Compute SVG points dynamically based on max value
  const maxVal = Math.max(...office, ...industrial, 10);
  const getSvgPoints = (arr) => {
    return arr
      .map((val, idx) => {
        const x = (idx / 11) * 1000;
        const y = 180 - (val / maxVal) * 150;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const officePoints = getSvgPoints(office);
  const polygonPoints = `0,180 ${officePoints} 1000,180`;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-jetbrains">
            Booking Trends
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly comparison of Commercial Office vs Industrial cleaning
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1d2f64]" />
            <span className="text-slate-700">Office</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-slate-700">Industrial</span>
          </div>
        </div>
      </div>

      {/* SVG Line Graph Container */}
      <div className="relative w-full h-56 pt-4">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="w-full border-b border-slate-300" />
          <div className="w-full border-b border-slate-300" />
          <div className="w-full border-b border-slate-300" />
          <div className="w-full border-b border-slate-300" />
        </div>

        {/* Dynamic SVG Trends Line */}
        <svg
          viewBox="0 0 1000 200"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="officeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d2f64" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1d2f64" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Dynamic Fill Area */}
          <polygon fill="url(#officeGrad)" points={polygonPoints} />

          {/* Dynamic Office Path */}
          <polyline
            fill="none"
            stroke="#1d2f64"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={officePoints}
          />

          {/* Dynamic Industrial Path */}
          <polyline
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeDasharray="5,5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getSvgPoints(industrial)}
          />
        </svg>

        {/* X-Axis Month Labels */}
        <div className="flex justify-between items-center pt-3 text-[11px] font-medium text-slate-400">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
