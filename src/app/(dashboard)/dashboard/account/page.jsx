"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useAuth } from "@/hook/useAuth";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const fileRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleProfileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const formData = new FormData();
    formData.append("avatar", file);
    if (user.avatar) {
      formData.append("oldAvatar", user.avatar);
    }
    try {
      setUploadingAvatar(true);
      const response = await fetch(`/api/users/${user.id || user._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }
      toast.success("Profile picture updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error(error.message);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    if (!nameVal.trim() || !user) return;
    const formData = new FormData();
    formData.append("name", nameVal.trim());
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id || user._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to update name");
      }
      toast.success("Account name updated successfully!");
      setIsEditingName(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
      console.error("Failed to change name:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-inter">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 font-jetbrains tracking-tight">
          Account Settings
        </h1>

        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Admin Session</span>
        </span>
      </div>

      {/* Settings Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Card Column */}
        <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-5">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-[#1d2f64] text-white font-extrabold text-3xl flex items-center justify-center border-4 border-slate-100 shadow-md overflow-hidden">
              {user?.avatar && !avatarError ? (
                <img
                  src={`/api/uploads/user/${user.avatar}`}
                  alt={user.name || "Admin"}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                getUserInitials(user?.name)
              )}
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-[#ed0505] text-white hover:bg-red-700 shadow-md transition-all cursor-pointer border-2 border-white"
              title="Upload Profile Picture"
              aria-label="Upload Avatar"
            >
              <Icon icon="lucide:camera" className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/jpg, image/jpeg, image/png, image/webp"
            onChange={handleProfileChange}
            hidden
          />

          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg font-jetbrains leading-snug">
              {user?.name || "Admin User"}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] mx-auto">
              {user?.email || "admin@clean.nyc"}
            </p>
          </div>

          <StatusBadge status={user?.role || "admin"} />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <Icon icon="lucide:upload-cloud" className="w-4 h-4 text-slate-500" />
            <span>{uploadingAvatar ? "Uploading Avatar..." : "Upload Profile Photo"}</span>
          </button>
        </div>

        {/* Main Details & Security Column */}
        <div className="md:col-span-8 space-y-6">
          {/* Account Info Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base font-jetbrains">
                Personal Profile Details
              </h3>
            </div>

            <div className="space-y-5">
              {/* Name Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Full Name
                  </label>
                  {!isEditingName && (
                    <button
                      onClick={() => {
                        setNameVal(user?.name || "");
                        setIsEditingName(true);
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Icon icon="lucide:edit-3" className="w-3.5 h-3.5" />
                      <span>Edit Name</span>
                    </button>
                  )}
                </div>

                {isEditingName ? (
                  <form onSubmit={handleNameChange} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d2f64]/15 focus:border-[#1d2f64] text-slate-900 font-bold shadow-2xs"
                      placeholder="Enter new full name"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2.5 rounded-xl bg-[#ed0505] hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={user?.name || "Admin"}
                    className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold cursor-default shadow-2xs"
                  />
                )}
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    readOnly
                    value={user?.email || "admin@clean.nyc"}
                    className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-semibold cursor-default shadow-2xs"
                  />
                  <Icon
                    icon="lucide:lock"
                    className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              {/* Role & Permissions */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Role & System Permission
                </label>
                <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#1d2f64] border border-blue-100">
                      <Icon icon="lucide:shield-check" className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs capitalize">
                        {user?.role || "Administrator"} Access
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Full administrative permissions granted
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={user?.role || "admin"} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
