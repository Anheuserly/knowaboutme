import Link from "next/link";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import {
  Sparkles,
  Eye,
  Mail,
  Share2,
  ExternalLink,
  ArrowRight,
  Palette,
  UserCheck,
  FolderGit2,
  CheckCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const session = await getSession();
  if (!session) return null;

  // Fetch profile, views, recent messages, and sections in a single performant query
  const res = await query(
    `SELECT 
      p.id, p.username, p.display_name, p.headline, p.short_bio, p.profile_photo_url, p.cover_image_url, p.theme_id,
      (SELECT COUNT(*) FROM profile_views pv WHERE pv.profile_id = p.id) as total_views,
      (SELECT COUNT(*) FROM profile_sections ps WHERE ps.profile_id = p.id AND ps.is_visible = TRUE) as active_sections,
      COALESCE((SELECT json_agg(cm.* ORDER BY cm.created_at DESC) FROM (SELECT * FROM contact_messages WHERE profile_id = p.id ORDER BY created_at DESC LIMIT 5) cm), '[]'::json) as recent_messages
     FROM profiles p
     WHERE p.user_id = $1
     LIMIT 1`,
    [session.id]
  );

  const profile = res.rows[0];
  const totalViews = Number(profile?.total_views || 0);
  const recentMessages = profile?.recent_messages || [];
  const activeSectionsCount = Number(profile?.active_sections || 0);

  // Calculate completeness score
  let score = 20; // base for registration
  if (profile?.display_name) score += 10;
  if (profile?.headline) score += 15;
  if (profile?.short_bio) score += 15;
  if (profile?.profile_photo_url) score += 15;
  if (profile?.cover_image_url) score += 10;
  if (activeSectionsCount > 2) score += 15;
  score = Math.min(100, score);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Welcome back, {profile?.display_name || "Creator"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Your identity profile is published and live at{" "}
            <Link
              href={`/@${profile?.username}`}
              target="_blank"
              className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>/@{profile?.username}</span>
              <ExternalLink size={12} />
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 transition-colors shadow-xs"
          >
            <span>Edit Profile</span>
          </Link>
          <Link
            href={`/@${profile?.username}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Eye size={14} />
            <span>View Live</span>
          </Link>
        </div>
      </div>

      {/* Completeness Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/5 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <Sparkles size={14} />
              <span>Profile Strength</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {score >= 80 ? "Your Identity is Looking Phenomenal!" : "Complete Your Identity to Stand Out"}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Profiles with photos, biographies, and at least 3 portfolio sections receive 4.5x more views and inquiries.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {score}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Total Profile Views</span>
            <Eye size={16} className="text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-400">Unique visitor engagements</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Direct Inquiries</span>
            <Mail size={16} className="text-purple-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
            {recentMessages.length}
          </div>
          <p className="text-[11px] text-neutral-400">Messages sent to your profile</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Active Sections</span>
            <FolderGit2 size={16} className="text-pink-500" />
          </div>
          <div className="text-3xl font-black text-neutral-900 dark:text-neutral-50">
            {activeSectionsCount}
          </div>
          <p className="text-[11px] text-neutral-400">Published portfolio sections</p>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
          Quick Studio Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/profile"
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-indigo-500 transition-all space-y-2 group"
          >
            <UserCheck size={20} className="text-indigo-600 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Biography &amp; Info
            </h4>
            <p className="text-[11px] text-neutral-500">
              Update headline, location, avatar &amp; story.
            </p>
          </Link>

          <Link
            href="/dashboard/appearance"
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-indigo-500 transition-all space-y-2 group"
          >
            <Palette size={20} className="text-purple-600 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Theme &amp; Colors
            </h4>
            <p className="text-[11px] text-neutral-500">
              Switch from Minimal to Glass or Dark OLED.
            </p>
          </Link>

          <Link
            href="/dashboard/social-links"
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-indigo-500 transition-all space-y-2 group"
          >
            <Share2 size={20} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Social Links
            </h4>
            <p className="text-[11px] text-neutral-500">
              Add GitHub, LinkedIn, X, Instagram, etc.
            </p>
          </Link>

          <Link
            href="/dashboard/sections"
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-indigo-500 transition-all space-y-2 group"
          >
            <FolderGit2 size={20} className="text-pink-600 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              Portfolio &amp; Work
            </h4>
            <p className="text-[11px] text-neutral-500">
              Add projects, experience, art &amp; skills.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            Recent Contact Inquiries
          </h3>
          <Link
            href="/dashboard/messages"
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <Mail size={24} className="mx-auto text-neutral-400" />
            <p className="text-xs font-medium text-neutral-500">
              No inquiries yet. Share your profile link to receive messages directly!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((m: any) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between sm:items-center gap-2 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {m.sender_name}
                    </span>
                    <span className="text-[11px] text-neutral-400">({m.sender_email})</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 line-clamp-1">
                    {m.message}
                  </p>
                </div>
                <span className="text-[10px] text-neutral-400 shrink-0">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
