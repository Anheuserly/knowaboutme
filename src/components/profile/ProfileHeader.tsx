"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Globe,
  CheckCircle2,
  Share2,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { PublicProfile } from "@/types/profile";
import type { ThemeConfig } from "@/lib/themes";
import { SocialIcon } from "./SocialIcon";
import { ShareModal } from "./ShareModal";

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

  return (
    <>
      <div className="relative w-full">
        {/* Cover Image */}
        <div
          className={`w-full overflow-hidden relative ${theme.coverAspect} max-h-[320px] rounded-b-2xl md:rounded-2xl`}
        >
          {profile.cover_image_url ? (
            <img
              src={profile.cover_image_url}
              alt={`${profile.display_name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Profile Card Main Info */}
        <div className="relative px-4 sm:px-8 max-w-4xl mx-auto -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-4">
            {/* Avatar & Identifiers */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-white dark:ring-neutral-900 shadow-xl bg-neutral-200 dark:bg-neutral-800 shrink-0">
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-neutral-500 uppercase bg-neutral-100 dark:bg-neutral-800">
                    {profile.display_name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50">
                    {profile.display_name}
                  </h1>
                  {profile.is_verified && (
                    <span title="Verified Identity" className="text-indigo-600 dark:text-indigo-400">
                      <CheckCircle2 size={22} className="fill-indigo-600 dark:fill-indigo-400 text-white dark:text-neutral-950" />
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                  <span>@{profile.username}</span>
                  {profile.pronouns && (
                    <>
                      <span>&bull;</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        {profile.pronouns}
                      </span>
                    </>
                  )}
                  {profile.profile_type && (
                    <>
                      <span>&bull;</span>
                      <span className="capitalize">{profile.profile_type}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions (Share & Contact) */}
            <div className="flex items-center gap-2.5 mt-2 sm:mt-0">
              <button
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-700 shadow-sm transition-all"
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>

              <button
                onClick={onContactClick}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Mail size={15} />
                <span>Get in Touch</span>
              </button>
            </div>
          </div>

          {/* Headline & Meta tags */}
          <div className="pt-3 pb-6 border-b border-neutral-200 dark:border-neutral-800/80">
            {profile.headline && (
              <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed max-w-3xl">
                {profile.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3.5 text-xs text-neutral-500 dark:text-neutral-400">
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
                  className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Globe size={14} />
                  <span>{profile.website_url.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink size={12} />
                </a>
              )}

              {profile.availability_status && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{profile.availability_status}</span>
                </div>
              )}
            </div>

            {/* Social Links Bar */}
            {profile.social_links && profile.social_links.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 mt-5">
                {profile.social_links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-950 dark:hover:text-white transition-all shadow-xs"
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
