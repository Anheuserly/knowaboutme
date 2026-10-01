export type ThemeConfig = {
  id: string;
  name: string;
  description: string;
  fontFamily: "sans" | "serif" | "mono";
  backgroundClass: string;
  surfaceClass: string;
  cardClass: string;
  textClass: string;
  textMutedClass: string;
  borderClass: string;
  accentColor: string;
  badgeClass: string;
  coverAspect: string;
  radius: "none" | "sm" | "md" | "lg" | "full";
};

export const THEMES: Record<string, ThemeConfig> = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Quiet, ultra-clean aesthetic focusing on pure whitespace and high-contrast typography.",
    fontFamily: "sans",
    backgroundClass: "bg-neutral-50 dark:bg-neutral-950",
    surfaceClass: "bg-white dark:bg-neutral-900",
    cardClass: "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm",
    textClass: "text-neutral-900 dark:text-neutral-50",
    textMutedClass: "text-neutral-500 dark:text-neutral-400",
    borderClass: "border-neutral-200 dark:border-neutral-800",
    accentColor: "#171717",
    badgeClass: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200",
    coverAspect: "aspect-[3.5/1]",
    radius: "md",
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Executive corporate presence with deep navy and slate tones.",
    fontFamily: "sans",
    backgroundClass: "bg-slate-50 dark:bg-slate-950",
    surfaceClass: "bg-white dark:bg-slate-900",
    cardClass: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md",
    textClass: "text-slate-900 dark:text-slate-100",
    textMutedClass: "text-slate-500 dark:text-slate-400",
    borderClass: "border-slate-200 dark:border-slate-800",
    accentColor: "#0284c7",
    badgeClass: "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800",
    coverAspect: "aspect-[3/1]",
    radius: "lg",
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Dynamic modern palette with indigo/violet accents and vibrant energy.",
    fontFamily: "sans",
    backgroundClass: "bg-[#0b0f19] text-white",
    surfaceClass: "bg-[#111827]/80 backdrop-blur-xl",
    cardClass: "bg-[#141d2f]/90 border border-indigo-500/20 shadow-xl shadow-indigo-950/20 backdrop-blur-xl",
    textClass: "text-slate-100",
    textMutedClass: "text-slate-400",
    borderClass: "border-indigo-500/20",
    accentColor: "#6366f1",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30",
    coverAspect: "aspect-[2.8/1]",
    radius: "lg",
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Luxurious editorial warmth featuring warm ivory, serif headings, and gold accents.",
    fontFamily: "serif",
    backgroundClass: "bg-[#fcfaf7] dark:bg-[#151210]",
    surfaceClass: "bg-white/90 dark:bg-[#1d1815]",
    cardClass: "bg-white dark:bg-[#1d1815] border border-[#e8dfd5] dark:border-[#332b25] shadow-sm",
    textClass: "text-[#2c241e] dark:text-[#f3ede6]",
    textMutedClass: "text-[#7d6f63] dark:text-[#a8998c]",
    borderClass: "border-[#e8dfd5] dark:border-[#332b25]",
    accentColor: "#c59b27",
    badgeClass: "bg-[#c59b27]/10 text-[#a37c15] dark:text-[#dfb94d] border border-[#c59b27]/30",
    coverAspect: "aspect-[3.2/1]",
    radius: "sm",
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "High-contrast geometric layout with bold typography and emerald accents.",
    fontFamily: "sans",
    backgroundClass: "bg-zinc-100 dark:bg-zinc-950",
    surfaceClass: "bg-white dark:bg-zinc-900",
    cardClass: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md",
    textClass: "text-zinc-900 dark:text-zinc-100",
    textMutedClass: "text-zinc-500 dark:text-zinc-400",
    borderClass: "border-zinc-200 dark:border-zinc-800",
    accentColor: "#10b981",
    badgeClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    coverAspect: "aspect-[3/1]",
    radius: "md",
  },
  portfolio: {
    id: "portfolio",
    name: "Portfolio",
    description: "Visual-forward design crafted specifically for designers, photographers, and architects.",
    fontFamily: "sans",
    backgroundClass: "bg-stone-50 dark:bg-stone-950",
    surfaceClass: "bg-white dark:bg-stone-900",
    cardClass: "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg",
    textClass: "text-stone-900 dark:text-stone-100",
    textMutedClass: "text-stone-500 dark:text-stone-400",
    borderClass: "border-stone-200 dark:border-stone-800",
    accentColor: "#f97316",
    badgeClass: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800",
    coverAspect: "aspect-[2.5/1]",
    radius: "lg",
  },
  editorial: {
    id: "editorial",
    name: "Editorial",
    description: "Magazine and journal styling with elegant columns and literary rhythm.",
    fontFamily: "serif",
    backgroundClass: "bg-[#f8f6f0] dark:bg-[#121212]",
    surfaceClass: "bg-white dark:bg-[#1a1a1a]",
    cardClass: "bg-white dark:bg-[#1a1a1a] border border-[#e0dcce] dark:border-[#2b2b2b] shadow-none",
    textClass: "text-neutral-900 dark:text-neutral-100",
    textMutedClass: "text-neutral-600 dark:text-neutral-400",
    borderClass: "border-[#e0dcce] dark:border-[#2b2b2b]",
    accentColor: "#b91c1c",
    badgeClass: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900",
    coverAspect: "aspect-[3.2/1]",
    radius: "none",
  },
  dark: {
    id: "dark",
    name: "Dark OLED",
    description: "Deep, focused, pure black theme optimized for OLED displays and developers.",
    fontFamily: "mono",
    backgroundClass: "bg-black text-neutral-100",
    surfaceClass: "bg-neutral-950",
    cardClass: "bg-neutral-950 border border-neutral-800 shadow-none",
    textClass: "text-neutral-100",
    textMutedClass: "text-neutral-400",
    borderClass: "border-neutral-800",
    accentColor: "#38bdf8",
    badgeClass: "bg-neutral-900 text-sky-400 border border-neutral-800",
    coverAspect: "aspect-[3/1]",
    radius: "sm",
  },
  glass: {
    id: "glass",
    name: "Glassmorphism",
    description: "Translucent frosted-glass panels with subtle iridescent gradients and soft blur.",
    fontFamily: "sans",
    backgroundClass: "bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white min-h-screen",
    surfaceClass: "bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20",
    cardClass: "bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/15 shadow-2xl shadow-purple-950/30",
    textClass: "text-white",
    textMutedClass: "text-slate-300",
    borderClass: "border-white/20",
    accentColor: "#a855f7",
    badgeClass: "bg-white/10 text-purple-200 border border-white/20 backdrop-blur-md",
    coverAspect: "aspect-[2.8/1]",
    radius: "lg",
  },
};

export function getTheme(themeId?: string | null): ThemeConfig {
  if (!themeId) return THEMES.creative;
  return THEMES[themeId.toLowerCase()] || THEMES.creative;
}
