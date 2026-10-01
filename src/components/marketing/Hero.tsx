"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Check, Layers, Share2 } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = usernameInput.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (clean) {
      router.push(`/register?username=${encodeURIComponent(clean)}`);
    } else {
      router.push(`/register`);
    }
  };

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Decorative ambient background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs animate-in fade-in slide-in-from-top-3 duration-500">
          <Sparkles size={14} className="text-indigo-500" />
          <span>The Next Evolution of Personal Identity</span>
          <span className="text-neutral-400">&bull;</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">KnowAboutMe 1.0</span>
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.08]">
            Your story. Your world. <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your identity.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            One person. One verified identity. One shareable URL. Build a comprehensive digital biography,
            portfolio, artwork gallery, and personal presence far beyond traditional resumes.
          </p>
        </div>

        {/* Claim Username Box */}
        <div className="max-w-lg mx-auto">
          <form
            onSubmit={handleClaim}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-indigo-950/5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
          >
            <div className="flex items-center w-full px-3 text-neutral-400 font-mono text-xs sm:text-sm">
              <span className="shrink-0 text-neutral-400 select-none">knowaboutme.com/@</span>
              <input
                type="text"
                placeholder="yourname"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 font-semibold focus:outline-none pl-0.5"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/25"
            >
              <span>Claim Profile</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-2.5">
            Free forever &bull; Custom themes &bull; Instant shareable QR code &bull; No ads
          </p>
        </div>

        {/* Social Proof Pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Verified Identity Badge</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Layers size={16} className="text-indigo-500" />
            <span>9 Adaptive Themes</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Share2 size={16} className="text-purple-500" />
            <span>QR &amp; vCard Sharing</span>
          </div>
        </div>
      </div>
    </section>
  );
}
