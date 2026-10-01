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

    const res = await query(
      `SELECT sl.* 
       FROM social_links sl
       JOIN profiles p ON sl.profile_id = p.id
       WHERE p.user_id = $1
       ORDER BY sl.display_order ASC`,
      [session.id]
    );

    return NextResponse.json({ success: true, socialLinks: res.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { platform, label, username, url } = body;

    if (!platform || !url) {
      return NextResponse.json({ success: false, error: "Platform and URL are required." }, { status: 400 });
    }

    const profRes = await query(`SELECT id FROM profiles WHERE user_id = $1 LIMIT 1`, [session.id]);
    if (!profRes.rowCount || profRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    const profileId = profRes.rows[0].id;

    // Get max display order
    const orderRes = await query(`SELECT COALESCE(MAX(display_order), 0) + 1 as next_order FROM social_links WHERE profile_id = $1`, [profileId]);
    const nextOrder = orderRes.rows[0].next_order;

    const insertRes = await query(
      `INSERT INTO social_links (id, profile_id, platform, label, username, url, display_order, is_visible, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true, NOW(), NOW())
       RETURNING *`,
      [profileId, platform, label || platform, username || null, url, nextOrder]
    );

    return NextResponse.json({ success: true, socialLink: insertRes.rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
