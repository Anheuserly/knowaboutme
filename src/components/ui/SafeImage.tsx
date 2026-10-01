"use client";

import React, { useState, useEffect } from "react";
import { ImageOff, Sparkles, FolderGit2, Palette } from "lucide-react";

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  fallbackType?: "avatar" | "cover" | "artwork" | "project" | "generic";
  initials?: string;
  containerClassName?: string;
  priority?: boolean;
}

function shouldProxyImmediately(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  // Domains that block hotlinking, lack CORS headers, or require server-side fetch
  return (
    lower.includes("ftcdn.net") ||
    lower.includes("discordapp.net") ||
    lower.includes("discordapp.com") ||
    lower.includes("pinimg.com") ||
    lower.includes("media.licdn.com") ||
    lower.includes("pbs.twimg.com") ||
    lower.includes("staticflickr.com")
  );
}

function resolveInitialSrc(src?: string | null): string | null {
  if (!src) return null;
  if (shouldProxyImmediately(src)) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  }
  return src;
}

export function SafeImage({
  src,
  alt,
  className = "",
  fallbackSrc,
  fallbackType = "generic",
  initials = "U",
  containerClassName = "",
  priority = false,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(resolveInitialSrc(src));
  const [hasAttemptedProxy, setHasAttemptedProxy] = useState(shouldProxyImmediately(src));
  const [hasFailedCompletely, setHasFailedCompletely] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const resolved = resolveInitialSrc(src);
    setCurrentSrc(resolved);
    setHasAttemptedProxy(shouldProxyImmediately(src));
    setHasFailedCompletely(!src);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    // If we haven't tried the internal image proxy yet and it's a remote URL, try proxying it
    if (
      !hasAttemptedProxy &&
      src &&
      src.startsWith("http") &&
      !currentSrc?.startsWith("/api/image-proxy")
    ) {
      setHasAttemptedProxy(true);
      setCurrentSrc(`/api/image-proxy?url=${encodeURIComponent(src)}`);
      return;
    }

    // If proxy also failed or custom fallback is provided
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    // Complete failure: render sleek UI fallback
    setHasFailedCompletely(true);
  };

  if (hasFailedCompletely || !currentSrc) {
    if (fallbackType === "avatar") {
      return (
        <div
          className={`w-full h-full flex items-center justify-center font-bold text-white uppercase select-none bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 ${containerClassName}`}
        >
          <span className="drop-shadow-sm text-2xl sm:text-3xl">{initials.slice(0, 2)}</span>
        </div>
      );
    }

    if (fallbackType === "cover") {
      return (
        <div
          className={`w-full h-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 ${containerClassName}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:32px_32px]" />
        </div>
      );
    }

    if (fallbackType === "artwork") {
      return (
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-neutral-900 text-neutral-400 ${containerClassName}`}
        >
          <Palette size={28} className="text-purple-400 mb-2 opacity-80" />
          <span className="text-xs font-medium text-neutral-300">{alt || "Artwork preview"}</span>
        </div>
      );
    }

    if (fallbackType === "project") {
      return (
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-950 text-neutral-400 ${containerClassName}`}
        >
          <FolderGit2 size={28} className="text-indigo-400 mb-2 opacity-80" />
          <span className="text-xs font-medium text-neutral-300">{alt || "Project showcase"}</span>
        </div>
      );
    }

    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400 ${containerClassName}`}
      >
        <ImageOff size={24} className="opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? "opacity-100" : "opacity-90"
      }`}
      {...props}
    />
  );
}
