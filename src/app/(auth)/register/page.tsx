"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, User, AtSign, AlertTriangle, RefreshCw } from "lucide-react";
import { BrandLogo } from "@/components/ui/LogoIcon";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const requested = searchParams.get("username");
    if (requested) {
      setUsername(requested.toLowerCase().replace(/[^a-z0-9_-]/g, ""));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          username: username.toLowerCase().trim(),
          displayName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Failed to create account.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center justify-center mb-1">
          <BrandLogo size="md" showBadge={false} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Claim Your Identity</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Create your verified personal page in under 60 seconds.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username claim */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Choose Your Username *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-neutral-400 text-xs font-mono">
              @
            </span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
              }
              placeholder="alex"
              maxLength={30}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1 font-mono">
            knowaboutme.com/@{username || "username"}
          </p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Display Name *
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Password * (min 8 characters)
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Creating Your Profile...</span>
            </>
          ) : (
            <>
              <span>Publish My Profile</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-neutral-500 dark:text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl flex items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
