import { NextResponse } from "next/server";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = await query(
      `SELECT s.*, p.profile_status, p.custom_domain, u.email
       FROM profile_settings s
       JOIN profiles p ON s.profile_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
       LIMIT 1`,
      [session.id]
    );

    if (!res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Settings not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: res.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Check if updating password
    if (body.current_password && body.new_password) {
      const userRes = await query(`SELECT password_hash FROM users WHERE id = $1 LIMIT 1`, [session.id]);
      if (!userRes.rowCount || userRes.rowCount === 0) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }

      const isValid = await verifyPassword(body.current_password, userRes.rows[0].password_hash);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
      }

      if (body.new_password.length < 8) {
        return NextResponse.json({ success: false, error: "New password must be at least 8 characters" }, { status: 400 });
      }

      const newHash = await hashPassword(body.new_password);
      await query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [newHash, session.id]);

      return NextResponse.json({ success: true, message: "Password updated successfully" });
    }

    // Check if updating profile_status
    if (body.profile_status) {
      await query(
        `UPDATE profiles SET profile_status = $1, updated_at = NOW() WHERE user_id = $2`,
        [body.profile_status, session.id]
      );
    }

    // Updating privacy/profile settings
    const profRes = await query(`SELECT id FROM profiles WHERE user_id = $1 LIMIT 1`, [session.id]);
    if (!profRes.rowCount || profRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    const profileId = profRes.rows[0].id;

    const allowedSettings = [
      "show_email",
      "show_phone",
      "allow_contact",
      "allow_indexing",
      "show_social_links",
      "show_location",
      "show_age",
      "show_view_count",
      "enable_analytics",
      "maintenance_mode",
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const key of allowedSettings) {
      if (typeof body[key] === "boolean") {
        updates.push(`${key} = $${idx}`);
        values.push(body[key]);
        idx++;
      }
    }

    if (updates.length > 0) {
      values.push(profileId);
      await query(
        `UPDATE profile_settings 
         SET ${updates.join(", ")}, updated_at = NOW()
         WHERE profile_id = $${idx}`,
        values
      );
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
