import { MetadataRoute } from "next";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://knowaboutme.com";

  try {
    const res = await query(
      `SELECT username, updated_at 
       FROM profiles 
       WHERE profile_status = 'published' 
       ORDER BY updated_at DESC 
       LIMIT 1000`
    );

    const profileUrls = res.rows.map((row) => ({
      url: `${baseUrl}/@${row.username}`,
      lastModified: new Date(row.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/login`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/register`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      ...profileUrls,
    ];
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
    ];
  }
}
