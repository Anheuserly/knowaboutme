import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import { profileUpdateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = await query(
      `SELECT p.*, s.show_email, s.show_phone, s.allow_contact, s.show_social_links, s.show_location, s.show_view_count
       FROM profiles p
       LEFT JOIN profile_settings s ON p.id = s.profile_id
       WHERE p.user_id = $1
       LIMIT 1`,
      [session.id]
    );

    if (!res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: res.rows[0] });
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
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const allowedFields = [
      "display_name",
      "headline",
      "profile_type",
      "short_bio",
      "long_bio",
      "profile_photo_url",
      "cover_image_url",
      "location",
      "website_url",
      "pronouns",
      "availability_status",
      "theme_id",
      "accent_color",
      "font_family",
      "seo_title",
      "seo_description",
    ];

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${idx}`);
        values.push(body[field]);
        idx++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update." }, { status: 400 });
    }

    values.push(session.id);
    const updateSql = `
      UPDATE profiles 
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE user_id = $${idx}
      RETURNING *
    `;

    const res = await query(updateSql, values);
    if (!res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: res.rows[0] });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
