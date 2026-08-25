"use client";

import React from "react";
import { Icon } from "@iconify/react";

export default function RecentActivityFeed({ activities = [] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5 font-inter">
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-jetbrains">
          Recent Activity
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time cleaner and quote operations log
        </p>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No recent activity recorded yet.
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3 text-sm">
              <div
                className={`p-2 rounded-xl border ${act.color || "text-blue-600 bg-blue-50 border-blue-100"} shrink-0 mt-0.5`}
              >
                <Icon icon={act.icon || "lucide:bell"} className="w-4 h-4" />
              </div>

              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-slate-800 text-xs truncate">
                  {act.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{act.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
