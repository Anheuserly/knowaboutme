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

    const [usersRes, profilesRes, viewsRes, messagesRes, recentUsersRes] = await Promise.all([
      query(`SELECT COUNT(*) as count FROM users`),
      query(`SELECT COUNT(*) as count, COUNT(*) FILTER (WHERE is_verified = TRUE) as verified FROM profiles`),
      query(`SELECT COUNT(*) as count FROM profile_views`),
      query(`SELECT COUNT(*) as count FROM contact_messages`),
      query(`SELECT u.email, u.created_at, p.username, p.display_name 
             FROM users u LEFT JOIN profiles p ON u.id = p.user_id 
             ORDER BY u.created_at DESC LIMIT 5`),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: Number(usersRes.rows[0]?.count || 0),
        totalProfiles: Number(profilesRes.rows[0]?.count || 0),
        verifiedProfiles: Number(profilesRes.rows[0]?.verified || 0),
        totalViews: Number(viewsRes.rows[0]?.count || 0),
        totalMessages: Number(messagesRes.rows[0]?.count || 0),
        recentUsers: recentUsersRes.rows,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
