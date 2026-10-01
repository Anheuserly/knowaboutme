"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Layers,
  Share2,
  Copy,
  ExternalLink,
  UserCheck,
  Palette,
  Briefcase,
  Mail,
  CheckCircle2,
  Eye,
  Settings,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface HeroProps {
  user?: {
    id: string;
    email: string;
    role: string;
    profile_id?: string;
    username?: string;
    display_name?: string;
    headline?: string;
    profile_photo_url?: string;
    cover_image_url?: string;
    theme_id?: string;
    is_verified?: boolean;
    total_views?: number;
    total_messages?: number;
  } | null;
}

export function Hero({ user }: HeroProps) {
  const router = useRouter();
  const [usernameInput, setUsernameInput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = usernameInput.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (clean) {
      router.push(`/register?username=${encodeURIComponent(clean)}`);
    } else {
      router.push(`/register`);
    }
  };

  const handleCopyLink = () => {
    if (!user?.username) return;
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/@${user.username}`
      : `https://knowaboutme.amcmep.in/@${user.username}`;

    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If user is logged in, show the personalized Smart Command Center
  if (user) {
    const initials = (user.display_name || user.username || "U").slice(0, 2).toUpperCase();
    const profileUrl = `/@${user.username}`;

    return (
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-sky-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Top Status Pill */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Identity Profile Live &bull; @{user.username}</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {user.display_name || user.username}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              Your personal identity platform is active. Manage your story, customize your themes, or share your digital presence with the world.
            </p>
          </div>

          {/* Smart Command Hub Card */}
          <div className="rounded-3xl overflow-hidden bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Identity Snapshot */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 pb-6 border-b border-neutral-100 dark:border-neutral-800/80 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-indigo-500/20 shadow-lg shrink-0 bg-neutral-200 dark:bg-neutral-800">
                  <SafeImage
                    src={user.profile_photo_url}
                    alt={user.display_name || "Profile"}
                    fallbackType="avatar"
                    initials={initials}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                      {user.display_name || user.username}
                    </h2>
                    {user.is_verified && (
                      <CheckCircle2 size={18} className="fill-indigo-600 text-white" />
                    )}
                  </div>
                  <p className="font-mono text-xs text-neutral-400">@{user.username}</p>
                  {user.headline && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-md line-clamp-1">
                      {user.headline}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all shadow-xs active:scale-95"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>

                <Link
                  href={profileUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 hover:scale-105"
                >
                  <Eye size={14} />
                  <span>View Live</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>

            {/* Quick Command Launchpad Grid */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Quick Command Launchpad
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link
                  href="/dashboard"
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-neutral-200/60 dark:border-neutral-700/60 transition-all group flex flex-col justify-between"
                >
                  <UserCheck size={20} className="text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Overview</h4>
                    <p className="text-[10px] text-neutral-500">Analytics &amp; Stats</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-neutral-200/60 dark:border-neutral-700/60 transition-all group flex flex-col justify-between"
                >
                  <Settings size={20} className="text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Edit Story</h4>
                    <p className="text-[10px] text-neutral-500">Bio, Avatar &amp; Cover</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/sections"
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-neutral-200/60 dark:border-neutral-700/60 transition-all group flex flex-col justify-between"
                >
                  <Layers size={20} className="text-sky-600 dark:text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Sections</h4>
                    <p className="text-[10px] text-neutral-500">Projects, Art, Work</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/appearance"
                  className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border border-neutral-200/60 dark:border-neutral-700/60 transition-all group flex flex-col justify-between"
                >
                  <Palette size={20} className="text-pink-600 dark:text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Themes</h4>
                    <p className="text-[10px] text-neutral-500">9 Adaptive Styles</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default Guest Hero
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
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/25 hover:scale-105 active:scale-95"
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
