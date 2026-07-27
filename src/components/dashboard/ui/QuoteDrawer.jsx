"use client";

import React from "react";
import { Icon } from "@iconify/react";
import StatusBadge from "./StatusBadge";

export default function QuoteDrawer({
  quote,
  isOpen,
  onClose,
  onDelete,
}) {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 border-l border-slate-200 font-inter">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold font-jetbrains text-slate-900">
                #NYC-{quote._id?.slice(-6).toUpperCase()}
              </h2>
              <StatusBadge status={quote.status || "pending"} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Requested on {quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : "Recent"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
            aria-label="Close"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Client Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Client & Contact Details
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2.5 border border-slate-200/60">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Full Name:</span>
                <span className="font-bold text-slate-900">
                  {quote.fullName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Company Name:</span>
                <span className="font-semibold text-slate-900">
                  {quote.companyName || "Personal"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Email Address:</span>
                <a
                  href={`mailto:${quote.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {quote.email}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Phone Number:</span>
                <a
                  href={`tel:${quote.phone}`}
                  className="font-semibold text-slate-900"
                >
                  {quote.phone || "N/A"}
                </a>
              </div>
            </div>
          </div>

          {/* Service Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Service Specifications
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2.5 border border-slate-200/60">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Facility Type:</span>
                <span className="font-bold text-slate-900 capitalize">
                  {quote.facilityType || "Standard Commercial"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Category:</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {quote.category || "General Clean"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Zip Code:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {quote.zipCode || "10001"}
                </span>
              </div>
            </div>
          </div>

          {/* Project Details / Message */}
          {quote.message && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quote Request Details
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-slate-700 leading-relaxed text-xs">
                "{quote.message}"
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
          {onDelete && (
            <button
              onClick={() => {
                onDelete(quote._id);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
              <span>Delete Quote</span>
            </button>
          )}
          <a
            href={`mailto:${quote.email}?subject=NYC%20Clean%20Commercial%20Quote%20Response%20%23NYC-${quote._id?.slice(-6).toUpperCase()}`}
            className="flex-1 px-4 py-2.5 rounded-xl text-white bg-[#ed0505] hover:bg-red-700 font-semibold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Icon icon="lucide:mail" className="w-4 h-4" />
            <span>Respond via Email</span>
          </a>
        </div>
      </div>
    </div>
  );
}
