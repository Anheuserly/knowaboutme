import Link from "next/link";
import { UserX, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
          <UserX size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Identity Not Found</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            This username hasn&apos;t been claimed yet or the profile is currently private.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/register"
            className="flex-1 py-3 px-4 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
          >
            Claim This Username
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 px-4 text-xs font-semibold rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors inline-flex items-center justify-center gap-1.5"
          >
            <Home size={15} />
            <span>Explore</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
