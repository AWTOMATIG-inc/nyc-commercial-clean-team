"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useAuth } from "@/hook/useAuth";

const NAV_GROUPS = [
  {
    category: "MAIN",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: "lucide:layout-dashboard",
      },
    ],
  },
  {
    category: "OPERATIONS",
    items: [
      {
        label: "Bookings",
        href: "/dashboard/bookings",
        icon: "lucide:calendar-check",
      },
      {
        label: "Quote Requests",
        href: "/dashboard/quotes",
        icon: "lucide:file-text",
      },
    ],
  },
  {
    category: "MARKETING",
    items: [
      {
        label: "Google Ads",
        href: "/dashboard/google-ads",
        icon: "lucide:megaphone",
      },
    ],
  },
  {
    category: "CONTENT MANAGEMENT",
    items: [
      {
        label: "Blogs & Articles",
        href: "/dashboard/blog",
        icon: "lucide:newspaper",
      },
      {
        label: "Client Feedback",
        href: "/dashboard/client-feedback",
        icon: "lucide:message-square",
      },
      {
        label: "Dynamic Pages",
        href: "/dashboard/pages",
        icon: "lucide:layers",
      },
    ],
  },
  {
    category: "USER MANAGEMENT",
    items: [
      {
        label: "Users & Admins",
        href: "/dashboard/users",
        icon: "lucide:users",
      },
      {
        label: "Subscribers",
        href: "/dashboard/subscribers",
        icon: "lucide:mail",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [counts, setCounts] = useState({ pendingBookings: 0, pendingQuotes: 0 });

  // Listen for mobile sidebar toggle event from Topbar
  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-mobile-sidebar", handleToggle);
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats) {
            setCounts({
              pendingBookings: data.stats.totalBookings || 0,
              pendingQuotes: data.stats.pendingQuotes || 0,
            });
          }
        }
      } catch (err) {
        // Silently handle count fetch error
      }
    }
    fetchCounts();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      } else {
        toast.error("Logout failed");
      }
    } catch (err) {
      toast.error("Logout failed: " + err.message);
    }
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  const getUserInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Navigation Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#1d2f64] text-white flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out font-inter shadow-xl border-r border-white/5 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1 custom-scrollbar">
          {/* Brand Header & Mobile Close */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-white/10">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-[#ed0505] flex items-center justify-center font-extrabold text-white text-base shadow-md font-jetbrains group-hover:scale-105 transition-transform">
                NYC
              </div>
              <div>
                <h1 className="font-extrabold text-base tracking-tight font-jetbrains leading-tight text-white flex items-center gap-1.5">
                  NYC CLEAN
                </h1>
                <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
                  Commercial Team
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Mobile Sidebar"
            >
              <Icon icon="lucide:x" className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.category} className="space-y-1.5">
                <h2 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.category}
                </h2>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    let badgeVal = null;
                    if (item.href === "/dashboard/quotes" && counts.pendingQuotes > 0) {
                      badgeVal = counts.pendingQuotes;
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          active
                            ? "bg-[#ed0505] text-white shadow-md shadow-red-900/30"
                            : "text-slate-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon icon={item.icon} className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>

                        {badgeVal !== null && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-[#ed0505] text-white"
                            }`}
                          >
                            {badgeVal}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Area: Settings, Site Link & Admin User Profile */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="space-y-1">
            <Link
              href="/dashboard/account"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                pathname === "/dashboard/account"
                  ? "bg-white/15 text-white font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon icon="lucide:settings" className="w-4 h-4" />
              <span>Account Settings</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <Icon icon="lucide:external-link" className="w-4 h-4" />
              <span>Back to Main Site</span>
            </Link>
          </div>

          {/* User Profile Card & Logout */}
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#ed0505] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {getUserInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-slate-300 truncate">
                  {user?.email || "admin@clean.nyc"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/15 transition-all cursor-pointer shrink-0"
              title="Logout from Admin Dashboard"
              aria-label="Logout"
            >
              <Icon icon="lucide:log-out" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
