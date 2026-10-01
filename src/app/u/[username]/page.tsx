import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { PublicProfile } from "@/types/profile";
import { ProfileThemeWrapper } from "@/components/profile/ProfileThemeWrapper";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

const getProfileData = cache(async (username: string): Promise<PublicProfile | null> => {
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase().trim();

  try {
    const session = await getSession();

    // 1. Fetch Profile, Settings, and All Related Sections in a single performant SQL query
    const profileRes = await query(
      `SELECT 
        p.*,
        s.show_email, s.show_phone, s.allow_contact, s.show_social_links, s.show_location, s.show_view_count,
        COALESCE((SELECT json_agg(sl.* ORDER BY sl.display_order ASC) FROM social_links sl WHERE sl.profile_id = p.id AND sl.is_visible = TRUE), '[]'::json) AS social_links,
        COALESCE((SELECT json_agg(e.* ORDER BY e.display_order ASC, e.start_date DESC) FROM experiences e WHERE e.profile_id = p.id), '[]'::json) AS experiences,
        COALESCE((SELECT json_agg(ed.* ORDER BY ed.display_order ASC, ed.start_date DESC) FROM education ed WHERE ed.profile_id = p.id), '[]'::json) AS education,
        COALESCE((SELECT json_agg(sk.* ORDER BY sk.display_order ASC) FROM skills sk WHERE sk.profile_id = p.id), '[]'::json) AS skills,
        COALESCE((SELECT json_agg(pr.* ORDER BY pr.display_order ASC) FROM projects pr WHERE pr.profile_id = p.id), '[]'::json) AS projects,
        COALESCE((SELECT json_agg(ar.* ORDER BY ar.display_order ASC) FROM artwork ar WHERE ar.profile_id = p.id), '[]'::json) AS artwork,
        COALESCE((SELECT json_agg(h.* ORDER BY h.display_order ASC) FROM hobbies h WHERE h.profile_id = p.id), '[]'::json) AS hobbies,
        COALESCE((SELECT json_agg(i.* ORDER BY i.display_order ASC) FROM interests i WHERE i.profile_id = p.id), '[]'::json) AS interests,
        COALESCE((SELECT json_agg(a.* ORDER BY a.display_order ASC) FROM achievements a WHERE a.profile_id = p.id), '[]'::json) AS achievements,
        COALESCE((SELECT json_agg(t.* ORDER BY t.display_order ASC) FROM testimonials t WHERE t.profile_id = p.id AND t.is_visible = TRUE AND t.is_approved = TRUE), '[]'::json) AS testimonials,
        COALESCE((SELECT json_agg(tl.* ORDER BY tl.display_order ASC, tl.event_date DESC) FROM timeline_events tl WHERE tl.profile_id = p.id), '[]'::json) AS timeline_events
      FROM profiles p
      LEFT JOIN profile_settings s ON p.id = s.profile_id
      WHERE LOWER(p.username) = LOWER($1)
      LIMIT 1`,
      [cleanUsername]
    );

    if (!profileRes.rowCount || profileRes.rowCount === 0) {
      return null;
    }

    const row = profileRes.rows[0];

    // If profile is not published, only the owner can view it
    const isOwner = session && session.username?.toLowerCase() === cleanUsername;
    if (row.profile_status !== "published" && !isOwner) {
      return null;
    }

    const profileId = row.id;

    // 2. Record Profile View safely in non-blocking manner (don't track owner views)
    if (!isOwner) {
      try {
        await query(
          `INSERT INTO profile_views (id, profile_id, viewed_at) VALUES (gen_random_uuid(), $1, NOW())`,
          [profileId]
        );
      } catch {
        // Non-critical, ignore if tracking fails
      }
    }

    return {
      id: row.id,
      username: row.username,
      display_name: row.display_name,
      headline: row.headline,
      profile_type: row.profile_type,
      short_bio: row.short_bio,
      long_bio: row.long_bio,
      profile_photo_url: row.profile_photo_url,
      cover_image_url: row.cover_image_url,
      location: row.location,
      website_url: row.website_url,
      pronouns: row.pronouns,
      availability_status: row.availability_status,
      is_verified: Boolean(row.is_verified),
      theme_id: row.theme_id || "creative",
      accent_color: row.accent_color,
      font_family: row.font_family,
      seo_title: row.seo_title,
      seo_description: row.seo_description,
      created_at: row.created_at,
      settings: {
        show_email: Boolean(row.show_email),
        show_phone: Boolean(row.show_phone),
        allow_contact: Boolean(row.allow_contact ?? true),
        show_social_links: Boolean(row.show_social_links ?? true),
        show_location: Boolean(row.show_location ?? true),
        show_view_count: Boolean(row.show_view_count),
      },
      social_links: row.social_links || [],
      experiences: row.experiences || [],
      education: row.education || [],
      skills: row.skills || [],
      projects: row.projects || [],
      artwork: row.artwork || [],
      hobbies: row.hobbies || [],
      interests: row.interests || [],
      achievements: row.achievements || [],
      testimonials: row.testimonials || [],
      timeline_events: row.timeline_events || [],
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
});

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfileData(username);

  if (!profile) {
    return {
      title: "Profile Not Found | KnowAboutMe",
      description: "The requested identity profile could not be found.",
    };
  }

  const title = profile.seo_title || `${profile.display_name} (@${profile.username}) | KnowAboutMe`;
  const description =
    profile.seo_description ||
    profile.headline ||
    profile.short_bio ||
    `Official personal identity and biographical portfolio of ${profile.display_name}.`;

  const canonicalUrl = `https://knowaboutme.amcmep.in/@${profile.username}`;
  const ogImages = profile.profile_photo_url ? [{ url: profile.profile_photo_url }] : [];

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "KnowAboutMe",
      images: ogImages,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: profile.profile_photo_url ? [profile.profile_photo_url] : [],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const profile = await getProfileData(username);

  if (!profile) {
    notFound();
  }

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    alternateName: profile.username,
    description: profile.headline || profile.short_bio,
    image: profile.profile_photo_url,
    url: `https://knowaboutme.amcmep.in/@${profile.username}`,
    sameAs: profile.social_links?.map((s) => s.url) || [],
    jobTitle: profile.headline,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProfileThemeWrapper profile={profile} />
    </>
  );
}
