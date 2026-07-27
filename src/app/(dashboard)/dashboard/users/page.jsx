"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import DataTable from "@/components/dashboard/ui/DataTable";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import MetricCard from "@/components/dashboard/ui/MetricCard";

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [failedAvatars, setFailedAvatars] = useState({});

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    const userConfirmed = confirm("Are you sure you want to delete this user account?");
    if (!userConfirmed) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success("User account deleted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRole = async (id, role) => {
    try {
      const formData = new FormData();
      formData.append("role", role);
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        return toast.error("Maximum of 5 admin accounts allowed");
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return toast.error(errData.error || "Failed to update user role");
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
      toast.success(`User role updated to ${role}`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.message);
    }
  };

  // Metrics
  const userMetrics = useMemo(() => {
    const total = users.length;
    const adminCount = users.filter((u) => (u.role || "").toLowerCase() === "admin").length;
    const standardCount = total - adminCount;
    return { total, adminCount, standardCount };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchQuery.toLowerCase().trim();
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const matchesSearch = !query || name.includes(query) || email.includes(query);

      const r = (u.role || "").toLowerCase();
      const matchesRole = roleFilter === "all" || r === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const columns = [
    {
      header: "User Profile",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1d2f64] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0 overflow-hidden">
            {row.avatar && !failedAvatars[row._id] ? (
              <img
                src={`/api/uploads/user/${row.avatar}`}
                alt={row.name || "User"}
                className="w-full h-full object-cover rounded-full"
                onError={() =>
                  setFailedAvatars((prev) => ({ ...prev, [row._id]: true }))
                }
              />
            ) : (
              getUserInitials(row.name)
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 capitalize">{row.name || "Unnamed User"}</p>
            <p className="text-xs text-slate-500 font-medium">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Current Role",
      accessor: "role",
      cell: (row) => <StatusBadge status={row.role || "user"} />,
    },
    {
      header: "Access Level / Role Selector",
      cell: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={row.role || "user"}
            onChange={(e) => handleRole(row._id, e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1d2f64] text-slate-800 font-bold transition-all cursor-pointer"
          >
            <option value="user">User (Standard Access)</option>
            <option value="admin">Admin (Full Dashboard)</option>
          </select>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => handleDelete(row._id, e)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            title="Delete User Account"
          >
            <Icon icon="lucide:trash-2" className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-jetbrains tracking-tight">
            User & Admin Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage user accounts, assign admin security permissions, and oversee platform access.
          </p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <MetricCard
          title="Total User Accounts"
          value={userMetrics.total.toString()}
          badgeText="Registered Users"
          badgeType="info"
          icon="lucide:users"
          description="Total users in application database"
        />
        <MetricCard
          title="Admin Accounts"
          value={`${userMetrics.adminCount} / 5`}
          badgeText={userMetrics.adminCount >= 5 ? "Limit Reached" : "Slots Available"}
          badgeType={userMetrics.adminCount >= 5 ? "danger" : "emerald"}
          icon="lucide:shield-check"
          description="Maximum of 5 admin profiles permitted"
        />
        <MetricCard
          title="Standard Users"
          value={userMetrics.standardCount.toString()}
          badgeText="Standard Clients"
          badgeType="success"
          icon="lucide:user-check"
          description="Clients with standard portal access"
        />
      </div>

      {/* Toolbar Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Icon
            icon="lucide:search"
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email address..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/20 focus:border-[#1d2f64] text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1d2f64] text-slate-700 font-semibold transition-all cursor-pointer w-full sm:w-auto"
        >
          <option value="all">Role: All Accounts</option>
          <option value="admin">Admins Only</option>
          <option value="user">Standard Users Only</option>
        </select>
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        isLoading={isLoading}
        emptyMessage="No user accounts found"
      />
    </div>
  );
}
