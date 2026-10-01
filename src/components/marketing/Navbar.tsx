"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, UserCheck, LogOut, ExternalLink } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface NavbarProps {
  initialUser?: any;
}

export function Navbar({ initialUser }: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(initialUser || null);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch {
      window.location.href = "/";
    }
  };

  const initials = (user?.display_name || user?.username || "U").slice(0, 2).toUpperCase();

  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
              KnowAboutMe
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              Identity Platform
            </span>
          </div>
        </Link>

        {/* Links & CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/@demo"
            className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:inline-block"
          >
            Explore Live Profile
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href={`/@${user.username}`}
                target="_blank"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 hidden sm:inline-flex px-3 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                  <SafeImage
                    src={user.profile_photo_url}
                    alt={user.display_name || user.username}
                    fallbackType="avatar"
                    initials={initials}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>@{user.username}</span>
                <ExternalLink size={10} className="opacity-60" />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <UserCheck size={14} />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Claim Profile</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
