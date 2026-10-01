"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface ProfileItem {
  id: string;
  username: string;
  display_name: string;
  headline?: string | null;
  profile_photo_url?: string | null;
  cover_image_url?: string | null;
  location?: string | null;
  theme_id?: string | null;
  is_verified?: boolean;
}

interface CommunityShowcaseProps {
  profiles: ProfileItem[];
}

export function CommunityShowcase({ profiles }: CommunityShowcaseProps) {
  if (!profiles || profiles.length === 0) return null;

  return (
    <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles size={14} />
          <span>Curated Community</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          Featured Digital Identities
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Discover how creators, developers, and visionaries express their multifaceted stories on KnowAboutMe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {profiles.map((p) => {
          const initials = (p.display_name || p.username || "U").slice(0, 2).toUpperCase();

          return (
            <div
              key={p.id}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* Cover Preview */}
                <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-neutral-900">
                  <SafeImage
                    src={p.cover_image_url}
                    alt={`${p.display_name} cover`}
                    fallbackType="cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Info Container */}
                <div className="px-6 pb-6 pt-0 relative">
                  {/* Floating Avatar */}
                  <div className="-mt-12 mb-3.5 flex items-end justify-between">
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-neutral-900 shadow-xl bg-neutral-200 dark:bg-neutral-800 shrink-0">
                      <SafeImage
                        src={p.profile_photo_url}
                        alt={p.display_name || p.username}
                        fallbackType="avatar"
                        initials={initials}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
                      Theme: {p.theme_id || "creative"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {p.display_name || p.username}
                      </h3>
                      {p.is_verified && (
                        <CheckCircle2
                          size={18}
                          className="fill-indigo-600 text-white dark:fill-indigo-400 dark:text-neutral-950"
                        />
                      )}
                    </div>

                    <p className="font-mono text-xs text-neutral-400">@{p.username}</p>

                    {p.headline && (
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                        {p.headline}
                      </p>
                    )}

                    {p.location && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-2">
                        <MapPin size={13} />
                        <span>{p.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                  knowaboutme.amcmep.in/@{p.username}
                </span>

                <Link
                  href={`/@${p.username}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Explore Profile</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
