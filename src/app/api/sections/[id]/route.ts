import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // e.g. experience, education, skills, projects, artwork, hobbies, interests, achievements, testimonials, timeline

    const profRes = await query(`SELECT id FROM profiles WHERE user_id = $1 LIMIT 1`, [session.id]);
    if (!profRes.rowCount || profRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    const profileId = profRes.rows[0].id;

    let tableName = "experiences";
    if (type === "education") tableName = "education";
    else if (type === "skills" || type === "skill") tableName = "skills";
    else if (type === "projects" || type === "project") tableName = "projects";
    else if (type === "artwork") tableName = "artwork";
    else if (type === "hobbies" || type === "hobby") tableName = "hobbies";
    else if (type === "interests" || type === "interest") tableName = "interests";
    else if (type === "achievements" || type === "achievement") tableName = "achievements";
    else if (type === "testimonials" || type === "testimonial") tableName = "testimonials";
    else if (type === "timeline" || type === "timeline_events") tableName = "timeline_events";

    const res = await query(
      `DELETE FROM ${tableName} WHERE id = $1 AND profile_id = $2 RETURNING id`,
      [id, profileId]
    );

    if (!res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
