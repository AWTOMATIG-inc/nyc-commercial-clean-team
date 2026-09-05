"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import MetricCard from "@/components/dashboard/ui/MetricCard";
import DataTable from "@/components/dashboard/ui/DataTable";
import AdsTrendChart from "@/components/dashboard/overview/AdsTrendChart";

const RANGES = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

const formatMoney = (n) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CAMPAIGN_STATUS = { 2: "ENABLED", 3: "PAUSED", 4: "REMOVED" };
const statusLabel = (status) => CAMPAIGN_STATUS[status] || "UNKNOWN";

export default function GoogleAdsPage() {
  const [range, setRange] = useState(30);
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/google-ads/overview?days=${range}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Failed to load Google Ads data");
        }
        setOverview(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [range]);

  const totals = overview?.totals || {
    impressions: 0,
    clicks: 0,
    cost: 0,
    conversions: 0,
    ctr: 0,
    avgCpc: 0,
    costPerConversion: null,
  };

  const spendSeries = (overview?.daily || []).map((d) => ({
    label: d.date?.slice(5).replace("-", "/"),
    value: d.cost,
  }));
  const clicksSeries = (overview?.daily || []).map((d) => ({
    label: d.date?.slice(5).replace("-", "/"),
    value: d.clicks,
  }));

  const columns = [
    {
      header: "Campaign",
      cell: (row) => <span className="font-bold text-slate-900">{row.name}</span>,
    },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${
            statusLabel(row.status) === "ENABLED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-500 border-slate-200"
          }`}
        >
          {statusLabel(row.status)}
        </span>
      ),
    },
    { header: "Clicks", cell: (row) => row.clicks.toLocaleString() },
    { header: "Impressions", cell: (row) => row.impressions.toLocaleString() },
    { header: "Spend", cell: (row) => formatMoney(row.cost) },
    { header: "Conversions", cell: (row) => row.conversions.toLocaleString() },
    {
      header: "Cost / Conversion",
      cell: (row) => (row.costPerConversion != null ? formatMoney(row.costPerConversion) : "—"),
    },
  ];

  return (
    <div className="space-y-8 font-inter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-jetbrains tracking-tight">
            Google Ads Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live campaign performance pulled from the connected Google Ads account
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-xs w-fit">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                range === r.value
                  ? "bg-[#1d2f64] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3">
          <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-rose-900">Couldn&apos;t load Google Ads data</p>
            <p className="text-[11px] text-rose-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Total Spend"
          value={isLoading ? "—" : formatMoney(totals.cost)}
          badgeText={`${range}D`}
          badgeType="info"
          icon="lucide:dollar-sign"
          description="Ad spend across all campaigns"
        />
        <MetricCard
          title="Clicks"
          value={isLoading ? "—" : totals.clicks.toLocaleString()}
          badgeText={`CTR ${totals.ctr.toFixed(2)}%`}
          badgeType="success"
          icon="lucide:mouse-pointer-click"
          description="Total clicks in range"
        />
        <MetricCard
          title="Conversions"
          value={isLoading ? "—" : totals.conversions.toLocaleString()}
          badgeText={
            totals.costPerConversion != null ? `${formatMoney(totals.costPerConversion)} / conv` : "—"
          }
          badgeType="emerald"
          icon="lucide:target"
          description="Tracked conversions in range"
        />
        <MetricCard
          title="Avg. CPC"
          value={isLoading ? "—" : formatMoney(totals.avgCpc)}
          badgeText={`${totals.impressions.toLocaleString()} impr.`}
          badgeType="warning"
          icon="lucide:trending-up"
          description="Average cost per click"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdsTrendChart
          title="Spend Trend"
          subtitle="Daily ad spend for the selected range"
          data={spendSeries}
          color="#1d2f64"
          formatValue={formatMoney}
        />
        <AdsTrendChart
          title="Clicks Trend"
          subtitle="Daily clicks for the selected range"
          data={clicksSeries}
          color="#ed0505"
        />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 font-jetbrains tracking-tight">
            Top Campaigns
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Ranked by spend in the selected range</p>
        </div>

        <DataTable
          columns={columns}
          data={overview?.campaigns || []}
          isLoading={isLoading}
          emptyMessage="No campaign activity in this range"
        />
      </div>
    </div>
  );
}
