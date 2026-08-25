"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useAuth } from "@/hook/useAuth";
import Breadcrumbs from "./Breadcrumbs";

export default function Topbar() {
  const router = useRouter();
  const { user } = useAuth();
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const quickActionRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (quickActionRef.current && !quickActionRef.current.contains(e.target)) {
        setIsQuickActionOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const getUserInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const toggleMobileSidebar = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("toggle-mobile-sidebar"));
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between gap-4 font-inter shadow-2xs">
      {/* Left: Mobile Menu Button & Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer shrink-0 border border-slate-200/80"
          aria-label="Open Mobile Menu"
          title="Toggle Navigation Menu"
        >
          <Icon icon="lucide:menu" className="w-5 h-5 text-slate-800" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button */}
        <div className="relative" ref={quickActionRef}>
          <button
            onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
            className="flex items-center gap-2 bg-[#ed0505] hover:bg-red-700 text-white px-3 py-2 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <Icon icon="lucide:plus" className="w-4 h-4" />
            <span className="hidden sm:inline">New Action</span>
            <Icon icon="lucide:chevron-down" className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Action Dropdown Menu */}
          {isQuickActionOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-700 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link
                href="/dashboard/bookings"
                onClick={() => setIsQuickActionOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <Icon icon="lucide:calendar-plus" className="w-4 h-4 text-emerald-600" />
                <span>Create New Booking</span>
              </Link>
              <Link
                href="/dashboard/quotes"
                onClick={() => setIsQuickActionOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <Icon icon="lucide:file-text" className="w-4 h-4 text-amber-600" />
                <span>Review Quote Requests</span>
              </Link>
              <Link
                href="/dashboard/blog/create"
                onClick={() => setIsQuickActionOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                <Icon icon="lucide:pen-tool" className="w-4 h-4 text-blue-600" />
                <span>Create Blog Article</span>
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
            aria-label="User Profile Menu"
          >
            <div className="w-8 h-8 rounded-full bg-[#1d2f64] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#1d2f64]/10">
              {getUserInitials(user?.name)}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 font-medium capitalize">
                {user?.role || "Administrator"}
              </p>
            </div>
            <Icon icon="lucide:chevron-down" className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900 text-xs truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || "admin@clean.nyc"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard/account"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <Icon icon="lucide:user" className="w-4 h-4 text-slate-500" />
                  <span>Account Settings</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <Icon icon="lucide:external-link" className="w-4 h-4 text-slate-500" />
                  <span>Visit Main Website</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold transition-colors cursor-pointer text-left"
                >
                  <Icon icon="lucide:log-out" className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
