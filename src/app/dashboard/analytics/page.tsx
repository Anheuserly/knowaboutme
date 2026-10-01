"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Eye,
  TrendingUp,
  Globe,
  Smartphone,
  Laptop,
  Compass,
  ShieldCheck,
} from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  last30Days: number;
  dailyViews: { day: string; views: string | number }[];
  devices: { device: string; count: string | number }[];
  referrers: { source: string; count: string | number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success && json.analytics) {
          setData(json.analytics);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const maxDailyViews = Math.max(
    1,
    ...(data?.dailyViews.map((d) => Number(d.views)) || [1])
  );

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          <BarChart3 className="text-indigo-600" size={24} />
          <span>Profile Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Real-time metrics on profile traffic, visitor origins, and device breakdown.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Total Profile Views</span>
            <Eye size={16} className="text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {(data?.totalViews || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Lifetime page views</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Last 30 Days</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {(data?.last30Days || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Recent engagement</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="text-xs font-semibold">Privacy Standard</span>
            <ShieldCheck size={16} className="text-sky-500" />
          </div>
          <div className="text-lg font-bold text-neutral-900 dark:text-neutral-50 tracking-tight pt-1">
            Zero-Cookie Tracking
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">GDPR & CCPA compliant</p>
        </div>
      </div>

      {/* 14-day views trend chart */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <TrendingUp size={16} className="text-indigo-600" />
          <span>Traffic Over Time (Last 14 Days)</span>
        </h2>

        {data?.dailyViews.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-xs">
            No daily traffic recorded in the past 14 days. Share your link to start tracking visits!
          </div>
        ) : (
          <div className="h-48 flex items-end gap-2 pt-6 px-2 overflow-x-auto">
            {data?.dailyViews.map((dayItem) => {
              const v = Number(dayItem.views);
              const heightPercent = Math.max(8, (v / maxDailyViews) * 100);

              return (
                <div
                  key={dayItem.day}
                  className="flex-1 min-w-[28px] flex flex-col items-center gap-2 group relative"
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none transition-opacity whitespace-nowrap z-10 font-mono">
                    {v} views on {dayItem.day}
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full rounded-t-lg bg-indigo-500/80 group-hover:bg-indigo-600 transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Date label */}
                  <span className="text-[9px] font-mono text-neutral-400 truncate max-w-full">
                    {dayItem.day.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Referrers & Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referrers */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Compass size={16} className="text-indigo-600" />
            <span>Top Traffic Referrers</span>
          </h2>

          {data?.referrers.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">No referrer data yet.</p>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {data?.referrers.map((ref) => (
                <div key={ref.source} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate pr-3">
                    {ref.source}
                  </span>
                  <span className="font-mono text-neutral-500 font-semibold shrink-0">
                    {Number(ref.count).toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Devices */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Laptop size={16} className="text-indigo-600" />
            <span>Device Types</span>
          </h2>

          {data?.devices.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">No device breakdown yet.</p>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {data?.devices.map((d) => (
                <div key={d.device} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 capitalize flex items-center gap-2">
                    {d.device === "mobile" ? <Smartphone size={14} /> : <Laptop size={14} />}
                    <span>{d.device}</span>
                  </span>
                  <span className="font-mono text-neutral-500 font-semibold">
                    {Number(d.count).toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
