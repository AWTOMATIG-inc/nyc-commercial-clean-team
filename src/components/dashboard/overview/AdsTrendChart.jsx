"use client";

import React from "react";

export default function AdsTrendChart({ title, subtitle, data = [], color = "#1d2f64", formatValue }) {
  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);

  const getSvgPoints = (arr) => {
    if (arr.length === 1) {
      return `0,${180 - (arr[0] / maxVal) * 150} 1000,${180 - (arr[0] / maxVal) * 150}`;
    }
    return arr
      .map((val, idx) => {
        const x = (idx / (arr.length - 1)) * 1000;
        const y = 180 - (val / maxVal) * 150;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const points = getSvgPoints(values);
  const polygonPoints = `0,180 ${points} 1000,180`;

  const firstLabel = data[0]?.label;
  const lastLabel = data[data.length - 1]?.label;
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 font-inter h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-jetbrains">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-slate-900 font-jetbrains">
            {formatValue ? formatValue(total) : total.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">Total in range</p>
        </div>
      </div>

      <div className="relative w-full h-40 pt-4">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="w-full border-b border-slate-300" />
          <div className="w-full border-b border-slate-300" />
          <div className="w-full border-b border-slate-300" />
        </div>

        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400 font-medium">
            No data for this range
          </div>
        ) : (
          <svg viewBox="0 0 1000 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon fill={`url(#grad-${title})`} points={polygonPoints} />
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        )}

        {data.length > 0 && (
          <div className="flex justify-between items-center pt-3 text-[11px] font-medium text-slate-400">
            <span>{firstLabel}</span>
            <span>{lastLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
