import React from "react";
import {
  Layers,
  Sparkles,
  Share2,
  Shield,
  Palette,
  QrCode,
  Smartphone,
  Lock,
  Search,
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Layers,
      title: "Modular Biography Sections",
      description: "More than a static resume. Showcase education, experience, skills, projects, artwork, hobbies, publications, timeline milestones, and endorsements.",
    },
    {
      icon: Palette,
      title: "9 Adaptive Themes",
      description: "Switch seamlessly between Minimalist, Executive Professional, Dark OLED, Glassmorphic, Editorial, and Creative themes with custom accent colors.",
    },
    {
      icon: QrCode,
      title: "Instant QR & vCard Sharing",
      description: "Generate high-resolution printable QR codes and download instant vCards so peers and recruiters can save your contact info with one tap.",
    },
    {
      icon: Shield,
      title: "Verified Identity & Privacy",
      description: "Granular controls over email and phone visibility, contact inquiry relays, search indexing toggles, and verified identity badges.",
    },
    {
      icon: Search,
      title: "SEO & Social Graph Ready",
      description: "Automatic JSON-LD Schema (Person, ProfilePage), dynamic OpenGraph social banners, sitemaps, and optimized search engine rankings.",
    },
    {
      icon: Smartphone,
      title: "Lightning-Fast Mobile First",
      description: "Built on Next.js 15 App Router, zero-lag server-rendered profiles, and lightweight bundle architecture.",
    },
  ];

  return (
    <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Unrivaled Capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Everything You Need to Own Your Digital Identity
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Designed from the ground up for artists, developers, founders, designers, and students who want to be remembered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:shadow-lg transition-all space-y-3.5 hover:translate-y-[-2px]"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
