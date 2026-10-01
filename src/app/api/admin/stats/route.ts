import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const statsRes = await query(
      `SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM profiles) as total_profiles,
        (SELECT COUNT(*) FROM profiles WHERE is_verified = TRUE) as verified_profiles,
        (SELECT COUNT(*) FROM profile_views) as total_views,
        (SELECT COUNT(*) FROM contact_messages) as total_messages,
        COALESCE((
          SELECT json_agg(ru.*)
          FROM (
            SELECT u.email, u.created_at, p.username, p.display_name 
            FROM users u LEFT JOIN profiles p ON u.id = p.user_id 
            ORDER BY u.created_at DESC LIMIT 5
          ) ru
        ), '[]'::json) as recent_users`
    );

    const row = statsRes.rows[0];

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: Number(row?.total_users || 0),
        totalProfiles: Number(row?.total_profiles || 0),
        verifiedProfiles: Number(row?.verified_profiles || 0),
        totalViews: Number(row?.total_views || 0),
        totalMessages: Number(row?.total_messages || 0),
        recentUsers: row?.recent_users || [],
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
