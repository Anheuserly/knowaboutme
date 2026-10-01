import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            K
          </div>
          <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
            KnowAboutMe
          </span>
          <span className="text-xs text-neutral-400 ml-2">
            &copy; {new Date().getFullYear()} KnowAboutMe Platform.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <Link href="/@demo" className="hover:text-indigo-600 transition-colors">
            Demo Profile
          </Link>
          <Link href="/login" className="hover:text-indigo-600 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-indigo-600 transition-colors">
            Claim URL
          </Link>
        </div>
      </div>
    </footer>
  );
}
