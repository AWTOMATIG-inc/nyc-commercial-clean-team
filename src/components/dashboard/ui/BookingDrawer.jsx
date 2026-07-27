"use client";

import React from "react";
import { Icon } from "@iconify/react";
import StatusBadge from "./StatusBadge";

export default function BookingDrawer({
  booking,
  isOpen,
  onClose,
  onStatusChange,
}) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left border-l border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold font-jetbrains text-slate-900">
                #{booking.bookingId || booking._id?.slice(-6)}
              </h2>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Submitted on {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-all cursor-pointer"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Client Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Client Information
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-semibold text-slate-900">
                  {booking.firstName} {booking.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Company:</span>
                <span className="font-semibold text-slate-900">
                  {booking.companyName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <a
                  href={`mailto:${booking.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {booking.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <a
                  href={`tel:${booking.phone}`}
                  className="font-medium text-slate-900"
                >
                  {booking.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Facility Specs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Facility Specifications
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Facility Type:</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {booking.facilityType || "Standard Office"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Facility Size:</span>
                <span className="font-medium text-slate-900">
                  {booking.facilitySize || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Property Address:</span>
                <span className="font-medium text-slate-900 text-right max-w-[200px]">
                  {booking.propertyAddress}, {booking.area} ({booking.zipCode})
                </span>
              </div>
            </div>
          </div>

          {/* Schedule & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Schedule & Requested Services
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Preferred Date:</span>
                <span className="font-semibold text-slate-900">
                  {booking.preferredStartDate || "Flexible"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cleaning Frequency:</span>
                <span className="font-semibold text-slate-900">
                  {booking.cleaningSchedule || "One-time"}
                </span>
              </div>
              {booking.services && booking.services.length > 0 && (
                <div>
                  <span className="text-slate-500 block mb-1.5">Services Requested:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="bg-white text-slate-700 px-2.5 py-1 rounded-lg text-xs border border-slate-200 font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Client Notes
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 italic">
                "{booking.notes}"
              </div>
            </div>
          )}
        </div>

        {/* Footer Quick Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          <button
            onClick={() => onStatusChange && onStatusChange(booking._id, "cencelled")}
            className="flex-1 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-all cursor-pointer"
          >
            Cancel Booking
          </button>
          <button
            onClick={() => onStatusChange && onStatusChange(booking._id, "confirmed")}
            className="flex-1 px-4 py-2.5 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
