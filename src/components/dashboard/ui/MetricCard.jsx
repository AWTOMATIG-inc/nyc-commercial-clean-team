"use client";

import React from "react";
import { Icon } from "@iconify/react";

export default function MetricCard({
  title,
  value,
  badgeText,
  badgeType = "success", // "success" | "warning" | "info" | "emerald"
  icon,
  description,
}) {
  const badgeStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const iconBgStyles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    danger: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group">
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider font-inter">
            {title}
          </p>
          {icon && (
            <div className={`p-2.5 rounded-xl border ${iconBgStyles[badgeType] || iconBgStyles.info} transition-transform group-hover:scale-105`}>
              <Icon icon={icon} className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-jetbrains tracking-tight">
            {value}
          </h3>

          {badgeText && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                badgeStyles[badgeType] || badgeStyles.success
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {description && (
        <p className="text-slate-400 text-xs mt-3 pt-3 border-t border-slate-100">
          {description}
        </p>
      )}
    </div>
  );
}
