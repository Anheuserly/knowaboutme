import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profRes = await query(`SELECT id FROM profiles WHERE user_id = $1 LIMIT 1`, [session.id]);
    if (!profRes.rowCount || profRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    const profileId = profRes.rows[0].id;

    // 1. Total views
    const totalRes = await query(
      `SELECT COUNT(*) as total FROM profile_views WHERE profile_id = $1`,
      [profileId]
    );

    // 2. Views in last 30 days
    const recentRes = await query(
      `SELECT COUNT(*) as last_30_days 
       FROM profile_views 
       WHERE profile_id = $1 AND viewed_at >= NOW() - INTERVAL '30 days'`,
      [profileId]
    );

    // 3. Daily breakdown over the last 14 days
    const dailyRes = await query(
      `SELECT TO_CHAR(viewed_at, 'YYYY-MM-DD') as day, COUNT(*) as views
       FROM profile_views
       WHERE profile_id = $1 AND viewed_at >= NOW() - INTERVAL '14 days'
       GROUP BY day
       ORDER BY day ASC`,
      [profileId]
    );

    // 4. Device breakdown
    const devicesRes = await query(
      `SELECT COALESCE(device_type, 'desktop') as device, COUNT(*) as count
       FROM profile_views
       WHERE profile_id = $1
       GROUP BY device
       ORDER BY count DESC`,
      [profileId]
    );

    // 5. Referrers
    const referrersRes = await query(
      `SELECT COALESCE(referrer, 'Direct / Link') as source, COUNT(*) as count
       FROM profile_views
       WHERE profile_id = $1
       GROUP BY source
       ORDER BY count DESC
       LIMIT 10`,
      [profileId]
    );

    return NextResponse.json({
      success: true,
      analytics: {
        totalViews: Number(totalRes.rows[0]?.total || 0),
        last30Days: Number(recentRes.rows[0]?.last_30_days || 0),
        dailyViews: dailyRes.rows,
        devices: devicesRes.rows,
        referrers: referrersRes.rows,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
