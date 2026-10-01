export type SocialPlatform = {
  id: string;
  name: string;
  baseUrlPrefix?: string;
  placeholder: string;
  iconName: string;
  color: string;
  category: "work" | "social" | "creative" | "code" | "audio" | "other";
};

export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  github: {
    id: "github",
    name: "GitHub",
    baseUrlPrefix: "https://github.com/",
    placeholder: "username or profile link",
    iconName: "Github",
    color: "#24292e",
    category: "code",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    baseUrlPrefix: "https://linkedin.com/in/",
    placeholder: "in/username or full URL",
    iconName: "Linkedin",
    color: "#0a66c2",
    category: "work",
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter)",
    baseUrlPrefix: "https://x.com/",
    placeholder: "@username",
    iconName: "Twitter",
    color: "#000000",
    category: "social",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    baseUrlPrefix: "https://instagram.com/",
    placeholder: "username",
    iconName: "Instagram",
    color: "#e4405f",
    category: "social",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    baseUrlPrefix: "https://youtube.com/@",
    placeholder: "@channel_name",
    iconName: "Youtube",
    color: "#ff0000",
    category: "creative",
  },
  threads: {
    id: "threads",
    name: "Threads",
    baseUrlPrefix: "https://threads.net/@",
    placeholder: "@username",
    iconName: "AtSign",
    color: "#000000",
    category: "social",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    baseUrlPrefix: "https://tiktok.com/@",
    placeholder: "@username",
    iconName: "Music2",
    color: "#000000",
    category: "creative",
  },
  dribbble: {
    id: "dribbble",
    name: "Dribbble",
    baseUrlPrefix: "https://dribbble.com/",
    placeholder: "username",
    iconName: "Dribbble",
    color: "#ea4c89",
    category: "creative",
  },
  behance: {
    id: "behance",
    name: "Behance",
    baseUrlPrefix: "https://behance.net/",
    placeholder: "username",
    iconName: "Palette",
    color: "#1769ff",
    category: "creative",
  },
  medium: {
    id: "medium",
    name: "Medium",
    baseUrlPrefix: "https://medium.com/@",
    placeholder: "@username",
    iconName: "BookOpen",
    color: "#000000",
    category: "creative",
  },
  devto: {
    id: "devto",
    name: "Dev.to",
    baseUrlPrefix: "https://dev.to/",
    placeholder: "username",
    iconName: "Code2",
    color: "#0a0a0a",
    category: "code",
  },
  stackoverflow: {
    id: "stackoverflow",
    name: "Stack Overflow",
    baseUrlPrefix: "https://stackoverflow.com/users/",
    placeholder: "profile ID or link",
    iconName: "Layers",
    color: "#f48024",
    category: "code",
  },
  spotify: {
    id: "spotify",
    name: "Spotify",
    baseUrlPrefix: "https://open.spotify.com/artist/",
    placeholder: "artist or user URL",
    iconName: "Disc",
    color: "#1db954",
    category: "audio",
  },
  soundcloud: {
    id: "soundcloud",
    name: "SoundCloud",
    baseUrlPrefix: "https://soundcloud.com/",
    placeholder: "username",
    iconName: "Headphones",
    color: "#ff5500",
    category: "audio",
  },
  twitch: {
    id: "twitch",
    name: "Twitch",
    baseUrlPrefix: "https://twitch.tv/",
    placeholder: "channel",
    iconName: "Tv",
    color: "#9146ff",
    category: "creative",
  },
  discord: {
    id: "discord",
    name: "Discord",
    placeholder: "invite link or username",
    iconName: "MessageSquare",
    color: "#5865f2",
    category: "social",
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    baseUrlPrefix: "https://t.me/",
    placeholder: "username",
    iconName: "Send",
    color: "#229ed9",
    category: "social",
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp",
    baseUrlPrefix: "https://wa.me/",
    placeholder: "phone number with country code",
    iconName: "PhoneCall",
    color: "#25d366",
    category: "social",
  },
  website: {
    id: "website",
    name: "Personal Website",
    placeholder: "https://yourwebsite.com",
    iconName: "Globe",
    color: "#6366f1",
    category: "work",
  },
  custom: {
    id: "custom",
    name: "Custom Link",
    placeholder: "https://...",
    iconName: "ExternalLink",
    color: "#4f46e5",
    category: "other",
  },
};

export function getPlatformMeta(platformName: string): SocialPlatform {
  const normalized = platformName.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, meta] of Object.entries(SOCIAL_PLATFORMS)) {
    if (key === normalized || meta.name.toLowerCase().replace(/[^a-z]/g, "") === normalized) {
      return meta;
    }
  }
  return SOCIAL_PLATFORMS.custom;
}
