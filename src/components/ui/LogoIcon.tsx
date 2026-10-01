"use client";

import React from "react";

interface LogoIconProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  glow?: boolean;
}

const SIZE_MAP = {
  xs: "w-5 h-5",
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export function LogoIcon({ size = "md", className = "", glow = true }: LogoIconProps) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl select-none ${sizeClass} ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />
      )}
      <svg
        viewBox="0 0 128 128"
        className="w-full h-full relative z-10 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f0f17" />
            <stop offset="50%" stopColor="#181329" />
            <stop offset="100%" stopColor="#090714" />
          </linearGradient>

          <linearGradient id="logoBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="logoKStem" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="logoKArm" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Base Squircle */}
        <rect
          x="6"
          y="6"
          width="116"
          height="116"
          rx="30"
          fill="url(#logoBg)"
          stroke="url(#logoBorder)"
          strokeWidth="2.5"
        />

        {/* Highlight sheen */}
        <path
          d="M 28 8 Q 64 16 100 8"
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Central Identity Iris / Radial Rings */}
        <circle
          cx="64"
          cy="65"
          r="30"
          stroke="#6366f1"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="64" cy="65" r="22" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1.5" />
        <circle cx="64" cy="65" r="14" fill="#0f0f17" stroke="#38bdf8" strokeOpacity="0.85" strokeWidth="2" />
        <circle cx="64" cy="65" r="5" fill="#38bdf8" />

        {/* Left Stem of 'K' */}
        <path
          d="M 32 34 
             C 32 30.5, 34.5 28, 38 28
             L 44 28
             C 47.5 28, 50 30.5, 50 34
             L 50 94
             C 50 97.5, 47.5 100, 44 100
             L 38 100
             C 34.5 100, 32 97.5, 32 94
             Z"
          fill="url(#logoKStem)"
        />
        <line
          x1="41"
          y1="33"
          x2="41"
          y2="95"
          stroke="#ffffff"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Upper Arm of 'K' */}
        <path
          d="M 52 62
             L 76 34
             C 78 31.5, 82 31.5, 84 34
             L 91 41
             C 93 43, 93 47, 90 49
             L 68 72
             Z"
          fill="url(#logoKArm)"
        />

        {/* Lower Arm of 'K' */}
        <path
          d="M 54 62
             L 72 50
             L 91 83
             C 93 86.5, 92 90, 88.5 92
             L 80 96
             C 77 97.5, 73.5 96.5, 71.5 93
             Z"
          fill="url(#logoKArm)"
        />

        {/* The Beacon Star */}
        <g>
          <path
            d="M 64 20 
               Q 64 28 72 28 
               Q 64 28 64 36 
               Q 64 28 56 28 
               Q 64 28 64 20 Z"
            fill="#ffffff"
          />
          <circle cx="64" cy="28" r="2.5" fill="#38bdf8" />
        </g>
      </svg>
    </div>
  );
}

export function BrandLogo({
  size = "md",
  showBadge = true,
  className = "",
}: {
  size?: "xs" | "sm" | "md" | "lg";
  showBadge?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <LogoIcon size={size} />
      <div className="flex items-center gap-2">
        <span className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          KnowAbout<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">Me</span>
        </span>
        {showBadge && (
          <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            Identity Platform
          </span>
        )}
      </div>
    </div>
  );
}
