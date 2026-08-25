"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 font-inter">
      <Link
        href="/dashboard"
        className="hover:text-slate-900 transition-colors flex items-center gap-1"
      >
        <span>Dashboard</span>
      </Link>

      {segments.slice(1).map((seg, idx) => {
        const href = "/" + segments.slice(0, idx + 2).join("/");
        const isLast = idx === segments.length - 2;
        const formatted = seg.replace(/-/g, " ");

        return (
          <React.Fragment key={href}>
            <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 text-slate-400" />
            {isLast ? (
              <span className="text-slate-900 font-semibold capitalize">{formatted}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-slate-900 transition-colors capitalize"
              >
                {formatted}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
