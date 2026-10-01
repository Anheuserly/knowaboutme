"use client";

import React, { useState } from "react";
import {
  MapPin,
  Globe,
  CheckCircle2,
  Share2,
  Mail,
  ExternalLink,
  Sparkles,
  Download,
  Calendar,
} from "lucide-react";
import type { PublicProfile } from "@/types/profile";
import type { ThemeConfig } from "@/lib/themes";
import { SocialIcon } from "./SocialIcon";
import { ShareModal } from "./ShareModal";
import { SafeImage } from "@/components/ui/SafeImage";

interface ProfileHeaderProps {
  profile: PublicProfile;
  theme: ThemeConfig;
  onContactClick?: () => void;
}

export function ProfileHeader({
  profile,
  theme,
  onContactClick,
}: ProfileHeaderProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const accentColor = profile.accent_color || theme.accentColor || "#6366f1";
  const initials = (profile.display_name || profile.username || "U").slice(0, 2).toUpperCase();

  const downloadVCard = () => {
    const profileUrl = typeof window !== "undefined"
      ? `${window.location.origin}/@${profile.username}`
      : `https://knowaboutme.amcmep.in/@${profile.username}`;

    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${profile.display_name};;;;
FN:${profile.display_name}
TITLE:${profile.headline || ""}
URL:${profile.website_url || profileUrl}
NOTE:${profile.short_bio || ""}
X-KNOWABOUTME-USERNAME:${profile.username}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${profile.username}-contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="relative w-full">
        {/* Cover Container */}
        <div
          className={`w-full overflow-hidden relative ${theme.coverAspect} max-h-[340px] rounded-b-3xl md:rounded-3xl border-b border-black/5 dark:border-white/5 shadow-inner`}
        >
          <SafeImage
            src={profile.cover_image_url}
            alt={`${profile.display_name} cover`}
            fallbackType="cover"
            priority={true}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Profile Identity Info Card */}
        <div className="relative px-4 sm:px-8 max-w-4xl mx-auto -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 pb-5">
            {/* Avatar & Display Name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-neutral-900 shadow-2xl bg-neutral-200 dark:bg-neutral-800 shrink-0 group">
                <SafeImage
                  src={profile.profile_photo_url}
                  alt={profile.display_name || profile.username || "Profile"}
                  fallbackType="avatar"
                  initials={initials}
                  priority={true}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-black/10 dark:ring-white/10"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {profile.display_name || profile.username}
                  </h1>
                  {profile.is_verified && (
                    <span
                      title="Verified Identity"
                      className="inline-flex items-center text-indigo-600 dark:text-indigo-400"
                    >
                      <CheckCircle2
                        size={22}
                        className="fill-indigo-600 dark:fill-indigo-400 text-white dark:text-neutral-950"
                      />
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">
                    @{profile.username}
                  </span>
                  {profile.pronouns && (
                    <>
                      <span className="opacity-40">&bull;</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-sans">
                        {profile.pronouns}
                      </span>
                    </>
                  )}
                  {profile.profile_type && (
                    <>
                      <span className="opacity-40">&bull;</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/60 capitalize font-medium">
                        {profile.profile_type}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-wrap justify-center">
              <button
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-700 shadow-xs hover:shadow-md transition-all active:scale-95"
                title="Share & QR Code"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>

              <button
                onClick={downloadVCard}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-700 shadow-xs transition-all active:scale-95"
                title="Download contact card"
              >
                <Download size={14} />
                <span>vCard</span>
              </button>

              {profile.settings?.allow_contact !== false && (
                <button
                  onClick={onContactClick}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl text-white shadow-lg transition-all active:scale-95 hover:opacity-95"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 8px 20px -4px ${accentColor}40`,
                  }}
                >
                  <Mail size={14} />
                  <span>Get in Touch</span>
                </button>
              )}
            </div>
          </div>

          {/* Headline & Meta tags */}
          <div className="pt-2 pb-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
            {profile.headline && (
              <p className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed max-w-3xl">
                {profile.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-xs text-neutral-500 dark:text-neutral-400">
              {profile.location && (
                <div className="inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-neutral-400" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline font-medium transition-colors"
                  style={{ color: accentColor }}
                >
                  <Globe size={14} />
                  <span>{profile.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              )}

              {profile.availability_status && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{profile.availability_status}</span>
                </div>
              )}
            </div>

            {/* Social Links Bar */}
            {profile.social_links && profile.social_links.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-5">
                {profile.social_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80 hover:text-neutral-950 dark:hover:text-white transition-all shadow-xs active:scale-95"
                    title={link.label || link.platform}
                  >
                    <SocialIcon platform={link.platform} size={15} showColor />
                    <span>{link.label || link.platform}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        profile={profile}
      />
    </>
  );
}
