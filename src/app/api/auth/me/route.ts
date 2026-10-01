import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: true, authenticated: false, user: null });
    }

    const userRes = await query(
      `SELECT u.id, u.email, u.role, p.id as profile_id, p.username, p.display_name, p.profile_photo_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = $1
       LIMIT 1`,
      [session.id]
    );

    if (!userRes.rowCount || userRes.rowCount === 0) {
      return NextResponse.json({ success: true, authenticated: false, user: null });
    }

    const user = userRes.rows[0];

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId: user.profile_id,
        username: user.username,
        displayName: user.display_name,
        profilePhotoUrl: user.profile_photo_url,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
