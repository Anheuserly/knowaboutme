"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Share2,
  Palette,
  Briefcase,
  FolderGit2,
  Eye,
} from "lucide-react";
import { THEMES } from "@/lib/themes";
import { SafeImage } from "@/components/ui/SafeImage";

export function InteractiveDemo() {
  const [activeThemeKey, setActiveThemeKey] = useState<string>("creative");
  const [activeTab, setActiveTab] = useState<"about" | "projects" | "artwork">("about");

  const currentTheme = THEMES[activeThemeKey] || THEMES.creative;

  return (
    <section className="py-20 bg-neutral-100/70 dark:bg-neutral-900/50 border-y border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interactive Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Designed for Distinctive Expression
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Switch themes below to witness how your identity profile seamlessly morphs between artistic, executive, and minimalist aesthetics.
          </p>
        </div>

        {/* Theme Selectors */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(THEMES).slice(0, 6).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setActiveThemeKey(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeThemeKey === key
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md scale-105"
                  : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Mock Device Container */}
        <div className="max-w-3xl mx-auto bg-neutral-900 rounded-3xl p-3 shadow-2xl border border-neutral-800">
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 text-[11px] text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="px-3 py-1 rounded-md bg-neutral-800/80 text-neutral-300">
              knowaboutme.com/@demo
            </div>
            <Link
              href="/@demo"
              target="_blank"
              className="hover:text-white inline-flex items-center gap-1 text-[10px]"
            >
              <span>Open Live</span>
              <ExternalLink size={10} />
            </Link>
          </div>

          {/* Rendered Theme Card */}
          <div
            className={`rounded-2xl overflow-hidden p-6 sm:p-8 transition-colors duration-300 ${currentTheme.backgroundClass} ${currentTheme.textClass}`}
          >
            {/* Mock Profile Hero */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500 shadow-md">
                <SafeImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Alex Morgan"
                  fallbackType="avatar"
                  initials="AM"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold">Alex Morgan</h3>
                  <CheckCircle2 size={16} className="text-indigo-500 fill-indigo-500 text-white" />
                </div>
                <p className="text-xs text-neutral-400 font-medium">@demo &bull; Creator</p>
                <p className="text-xs opacity-90">Principal Designer &amp; Creative Technologist</p>
              </div>
            </div>

            {/* Mock Tabs */}
            <div className="flex items-center gap-4 mt-6 border-b border-neutral-200/20 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("about")}
                className={`pb-1 transition-colors ${
                  activeTab === "about"
                    ? "border-b-2 border-indigo-500 text-indigo-400 font-bold"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                Biography
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`pb-1 transition-colors ${
                  activeTab === "projects"
                    ? "border-b-2 border-indigo-500 text-indigo-400 font-bold"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("artwork")}
                className={`pb-1 transition-colors ${
                  activeTab === "artwork"
                    ? "border-b-2 border-indigo-500 text-indigo-400 font-bold"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                Artwork
              </button>
            </div>

            {/* Tab Contents */}
            <div className="mt-4">
              {activeTab === "about" && (
                <div className={`${currentTheme.cardClass} rounded-xl p-4 text-xs leading-relaxed space-y-2`}>
                  <p className="font-medium">
                    Exploring the intersection of human psychology, tactile interface aesthetics, and generative systems.
                  </p>
                  <p className="opacity-80">
                    Over the past 12 years, I have helped early-stage ventures and global design ateliers distill complex frontiers into intuitive human experiences.
                  </p>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className={`${currentTheme.cardClass} rounded-xl p-3.5 space-y-1`}>
                    <h5 className="font-bold">Aura UI Design System</h5>
                    <p className="text-[11px] opacity-75">Accessible tactile component library.</p>
                  </div>
                  <div className={`${currentTheme.cardClass} rounded-xl p-3.5 space-y-1`}>
                    <h5 className="font-bold">Chronos Spatial Audio</h5>
                    <p className="text-[11px] opacity-75">3D WebGL sound synthesizer.</p>
                  </div>
                </div>
              )}

              {activeTab === "artwork" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-neutral-800">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80"
                      alt="Art 1"
                      fallbackType="artwork"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden bg-neutral-800">
                    <SafeImage
                      src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=500&q=80"
                      alt="Art 2"
                      fallbackType="artwork"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
