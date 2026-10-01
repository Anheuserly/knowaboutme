"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Palette,
  Share2,
  FolderGit2,
  Mail,
  BarChart3,
  Settings,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface DashboardSidebarProps {
  username?: string;
  role?: string;
}

export function DashboardSidebar({ username, role }: DashboardSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Edit Profile", href: "/dashboard/profile", icon: User },
    { label: "Appearance & Themes", href: "/dashboard/appearance", icon: Palette },
    { label: "Social Links", href: "/dashboard/social-links", icon: Share2 },
    { label: "Sections & Portfolio", href: "/dashboard/sections", icon: FolderGit2 },
    { label: "Inquiries & Messages", href: "/dashboard/messages", icon: Mail },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Settings & Privacy", href: "/dashboard/settings", icon: Settings },
  ];

  if (role === "super_admin" || role === "admin") {
    navItems.push({ label: "Admin Console", href: "/admin", icon: ShieldCheck });
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Public Profile View Box */}
      {username && (
        <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500">
            <span>Your Live Link</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 truncate">
            /@{username}
          </p>
          <Link
            href={`/@${username}`}
            target="_blank"
            className="w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 flex items-center justify-center gap-1 transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      )}
    </aside>
  );
}
