"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface FooterProps {
  user?: {
    username?: string;
    display_name?: string;
  } | null;
}

export function Footer({ user }: FooterProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-950 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            K
          </div>
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
            KnowAboutMe
          </span>
          <span className="text-xs text-neutral-400 ml-2">
            &copy; {new Date().getFullYear()} KnowAboutMe Platform &bull; One person. One identity.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <Link href="/@demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Demo Showcase
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
              >
                Dashboard
              </Link>
              {user.username && (
                <Link
                  href={`/@${user.username}`}
                  target="_blank"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-mono"
                >
                  View @{user.username}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="hover:text-red-500 transition-colors inline-flex items-center gap-1"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
                Claim URL
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
