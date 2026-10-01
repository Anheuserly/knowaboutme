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

async function getProfileData(username: string): Promise<PublicProfile | null> {
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase().trim();

  try {
    const session = await getSession();

    // 1. Fetch Profile and User Settings
    const profileRes = await query(
      `SELECT p.*, s.show_email, s.show_phone, s.allow_contact, s.show_social_links, s.show_location, s.show_view_count
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

    // 2. Concurrently fetch all sections
    const [
      socialsRes,
      expRes,
      eduRes,
      skillsRes,
      projRes,
      artRes,
      hobbiesRes,
      interestsRes,
      achRes,
      testRes,
      timelineRes,
    ] = await Promise.all([
      query(`SELECT * FROM social_links WHERE profile_id = $1 AND is_visible = TRUE ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM experiences WHERE profile_id = $1 ORDER BY display_order ASC, start_date DESC`, [profileId]),
      query(`SELECT * FROM education WHERE profile_id = $1 ORDER BY display_order ASC, start_date DESC`, [profileId]),
      query(`SELECT * FROM skills WHERE profile_id = $1 ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM projects WHERE profile_id = $1 ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM artwork WHERE profile_id = $1 ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM hobbies WHERE profile_id = $1 ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM interests WHERE profile_id = $1 ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM achievements WHERE profile_id = $1 ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM testimonials WHERE profile_id = $1 AND is_visible = TRUE AND is_approved = TRUE ORDER BY display_order ASC`, [profileId]),
      query(`SELECT * FROM timeline_events WHERE profile_id = $1 ORDER BY display_order ASC, event_date DESC`, [profileId]),
    ]);

    // 3. Record Profile View asynchronously (non-blocking, don't count owner)
    if (!isOwner) {
      query(
        `INSERT INTO profile_views (id, profile_id, viewed_at) VALUES (gen_random_uuid(), $1, NOW())`,
        [profileId]
      ).catch(() => {});
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
      social_links: socialsRes.rows || [],
      experiences: expRes.rows || [],
      education: eduRes.rows || [],
      skills: skillsRes.rows || [],
      projects: projRes.rows || [],
      artwork: artRes.rows || [],
      hobbies: hobbiesRes.rows || [],
      interests: interestsRes.rows || [],
      achievements: achRes.rows || [],
      testimonials: testRes.rows || [],
      timeline_events: timelineRes.rows || [],
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

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
