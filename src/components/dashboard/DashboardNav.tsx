"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, Menu, X, Sparkles } from "lucide-react";

interface DashboardNavProps {
  user: any;
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            K
          </div>
          <span className="text-base font-bold text-neutral-900 dark:text-neutral-50 hidden sm:inline-block">
            KnowAboutMe Studio
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user?.username && (
          <Link
            href={`/@${user.username}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 transition-colors"
          >
            <span>Preview Profile</span>
            <ExternalLink size={12} />
          </Link>
        )}

        {/* User Pill & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center uppercase">
              {user?.displayName ? user.displayName.charAt(0) : "U"}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate max-w-[120px]">
                {user?.displayName || "Creator"}
              </div>
              <div className="text-[10px] text-neutral-400">@{user?.username}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-xl text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
