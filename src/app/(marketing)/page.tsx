import React from "react";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { CommunityShowcase } from "@/components/marketing/CommunityShowcase";
import { InteractiveDemo } from "@/components/marketing/InteractiveDemo";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  let user = null;

  try {
    const session = await getSession();
    if (session) {
      const userRes = await query(
        `SELECT u.id, u.email, u.role, p.id as profile_id, p.username, p.display_name, p.headline, p.profile_photo_url, p.cover_image_url, p.theme_id, p.is_verified
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.id = $1 LIMIT 1`,
        [session.id]
      );
      if (userRes.rowCount && userRes.rowCount > 0) {
        user = userRes.rows[0];
      }
    }
  } catch (error) {
    console.error("Error fetching session on homepage:", error);
  }

  // Fetch featured curated identities (Shubham Kumar @ohwownice, Alex Morgan @demo)
  let featuredProfiles: any[] = [];
  try {
    const featuredRes = await query(
      `SELECT id, username, display_name, headline, profile_photo_url, cover_image_url, location, theme_id, is_verified
       FROM profiles
       WHERE LOWER(username) IN ('ohwownice', 'demo') AND profile_status = 'published'
       ORDER BY CASE WHEN LOWER(username) = 'ohwownice' THEN 0 ELSE 1 END`
    );
    featuredProfiles = featuredRes.rows || [];
  } catch (error) {
    console.error("Error fetching featured profiles:", error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 selection:bg-indigo-500 selection:text-white">
      <Navbar initialUser={user} />
      <main>
        <Hero user={user} />
        {featuredProfiles.length > 0 && (
          <CommunityShowcase profiles={featuredProfiles} />
        )}
        <InteractiveDemo />
        <Features />
      </main>
      <Footer user={user} />
    </div>
  );
}
