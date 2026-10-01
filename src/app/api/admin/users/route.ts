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

    const res = await query(
      `SELECT u.id, u.email, u.role, u.status, u.created_at, u.last_login_at,
              p.username, p.display_name, p.profile_type, p.profile_status, p.is_verified, p.theme_id
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       ORDER BY u.created_at DESC`
    );

    return NextResponse.json({ success: true, users: res.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, status, role, is_verified } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 });
    }

    if (status) {
      await query(`UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2`, [status, userId]);
    }

    if (role) {
      await query(`UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2`, [role, userId]);
    }

    if (typeof is_verified === "boolean") {
      await query(`UPDATE profiles SET is_verified = $1, updated_at = NOW() WHERE user_id = $2`, [is_verified, userId]);
    }

    return NextResponse.json({ success: true, message: "User updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
