"use client";

import React, { useRef } from "react";
import type { PublicProfile } from "@/types/profile";
import { getTheme } from "@/lib/themes";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileSections } from "./ProfileSections";
import { LogoIcon } from "@/components/ui/LogoIcon";

interface ProfileThemeWrapperProps {
  profile: PublicProfile;
}

export function ProfileThemeWrapper({ profile }: ProfileThemeWrapperProps) {
  const theme = getTheme(profile.theme_id);
  const contactRef = useRef<HTMLDivElement | null>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen ${theme.backgroundClass} ${theme.textClass} transition-colors duration-300 pb-20`}
      style={
        {
          "--primary": profile.accent_color || theme.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Top Identity Banner */}
      <header className="max-w-4xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-neutral-400">
        <a
          href="/"
          className="inline-flex items-center gap-2 font-bold tracking-tight hover:text-indigo-500 transition-colors group"
        >
          <LogoIcon size="xs" />
          <span className="text-neutral-900 dark:text-neutral-100 font-bold text-xs">
            KnowAbout<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">Me</span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-neutral-400">
            One identity. One story.
          </span>
          <a
            href="/register"
            className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-200 transition-colors"
          >
            Claim your link &rarr;
          </a>
        </div>
      </header>

      {/* Main Profile Header */}
      <ProfileHeader
        profile={profile}
        theme={theme}
        onContactClick={scrollToContact}
      />

      {/* Main Profile Sections */}
      <ProfileSections
        profile={profile}
        theme={theme}
        contactRef={contactRef}
      />

      {/* Footer watermark */}
      <footer className="max-w-4xl mx-auto px-4 text-center mt-12 pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 text-xs text-neutral-400">
        <p>
          Powered by{" "}
          <a href="/" className="font-semibold text-neutral-600 dark:text-neutral-300 hover:underline">
            KnowAboutMe
          </a>{" "}
          &bull; The Personal Identity &amp; Biography Platform
        </p>
      </footer>
    </div>
  );
}
