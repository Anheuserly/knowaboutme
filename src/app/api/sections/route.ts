import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // e.g. experience, projects, skills, all, profile_sections

    const profRes = await query(`SELECT id FROM profiles WHERE user_id = $1 LIMIT 1`, [session.id]);
    if (!profRes.rowCount || profRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    const profileId = profRes.rows[0].id;

    if (type === "profile_sections") {
      const res = await query(
        `SELECT * FROM profile_sections WHERE profile_id = $1 ORDER BY display_order ASC`,
        [profileId]
      );
      return NextResponse.json({ success: true, sections: res.rows });
    }

    let tableName = "experiences";
    if (type === "education") tableName = "education";
    else if (type === "skills") tableName = "skills";
    else if (type === "projects") tableName = "projects";
    else if (type === "artwork") tableName = "artwork";
    else if (type === "hobbies") tableName = "hobbies";
    else if (type === "interests") tableName = "interests";
    else if (type === "achievements") tableName = "achievements";
    else if (type === "testimonials") tableName = "testimonials";
    else if (type === "timeline") tableName = "timeline_events";

    const res = await query(
      `SELECT * FROM ${tableName} WHERE profile_id = $1 ORDER BY display_order ASC, created_at DESC`,
      [profileId]
    );

    return NextResponse.json({ success: true, items: res.rows });
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
    const { sectionType, data } = body;

    const profRes = await query(`SELECT id FROM profiles WHERE user_id = $1 LIMIT 1`, [session.id]);
    if (!profRes.rowCount || profRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    const profileId = profRes.rows[0].id;

    if (sectionType === "experience") {
      const res = await query(
        `INSERT INTO experiences (id, profile_id, company_name, position, description, location, start_date, end_date, is_current, company_url, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.company_name,
          data.position,
          data.description || null,
          data.location || null,
          data.start_date ? new Date(data.start_date) : null,
          data.end_date ? new Date(data.end_date) : null,
          Boolean(data.is_current),
          data.company_url || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "project") {
      const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await query(
        `INSERT INTO projects (id, profile_id, name, slug, description, role, technologies, project_url, github_url, cover_image_url, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.name,
          slug,
          data.description || null,
          data.role || null,
          JSON.stringify(Array.isArray(data.technologies) ? data.technologies : (typeof data.technologies === "string" ? data.technologies.split(",").map((s: string) => s.trim()).filter(Boolean) : [])),
          data.project_url || null,
          data.github_url || null,
          data.cover_image_url || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "skill") {
      const res = await query(
        `INSERT INTO skills (id, profile_id, name, category, proficiency, years_experience, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.name,
          data.category || "General",
          Number(data.proficiency || 80),
          data.years_experience ? Number(data.years_experience) : null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "education") {
      const res = await query(
        `INSERT INTO education (id, profile_id, institution_name, degree, field_of_study, description, location, start_date, end_date, grade, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.institution_name,
          data.degree || null,
          data.field_of_study || null,
          data.description || null,
          data.location || null,
          data.start_date ? new Date(data.start_date) : null,
          data.end_date ? new Date(data.end_date) : null,
          data.grade || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "artwork") {
      const res = await query(
        `INSERT INTO artwork (id, profile_id, title, description, category, image_url, external_url, license, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.title,
          data.description || null,
          data.category || "Art",
          data.image_url || null,
          data.external_url || null,
          data.license || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "hobby") {
      const res = await query(
        `INSERT INTO hobbies (id, profile_id, name, description, icon, image_url, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.name,
          data.description || null,
          data.icon || null,
          data.image_url || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "interest") {
      const res = await query(
        `INSERT INTO interests (id, profile_id, name, category, description, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.name,
          data.category || "General",
          data.description || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "achievement") {
      const res = await query(
        `INSERT INTO achievements (id, profile_id, title, description, organization, achievement_date, credential_url, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.title,
          data.description || null,
          data.organization || null,
          data.achievement_date ? new Date(data.achievement_date) : null,
          data.credential_url || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "testimonial") {
      const res = await query(
        `INSERT INTO testimonials (id, profile_id, name, role, company, message, photo_url, website_url, is_approved, is_visible, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, true, true, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.name,
          data.role || null,
          data.company || null,
          data.message,
          data.photo_url || null,
          data.website_url || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    if (sectionType === "timeline") {
      const res = await query(
        `INSERT INTO timeline_events (id, profile_id, title, description, event_date, event_type, image_url, external_url, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [
          profileId,
          data.title,
          data.description || null,
          data.event_date ? new Date(data.event_date) : null,
          data.event_type || "milestone",
          data.image_url || null,
          data.external_url || null,
        ]
      );
      return NextResponse.json({ success: true, item: res.rows[0] });
    }

    return NextResponse.json({ success: false, error: "Unsupported section type" }, { status: 400 });
  } catch (error: any) {
    console.error("Section create error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Update profile_sections ordering and visibility
export async function PUT(req: Request) {
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

    const body = await req.json();
    const { sections } = body; // Array of { section_type, is_visible, display_order }

    if (!Array.isArray(sections)) {
      return NextResponse.json({ success: false, error: "Sections array required" }, { status: 400 });
    }

    for (const sec of sections) {
      await query(
        `INSERT INTO profile_sections (id, profile_id, section_type, display_order, is_visible, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
         ON CONFLICT (id) DO NOTHING`,
        [profileId, sec.section_type, sec.display_order, sec.is_visible]
      );
      // Also update existing if match by profile_id and section_type
      await query(
        `UPDATE profile_sections
         SET display_order = $1, is_visible = $2, updated_at = NOW()
         WHERE profile_id = $3 AND section_type = $4`,
        [sec.display_order, sec.is_visible, profileId, sec.section_type]
      );
    }

    return NextResponse.json({ success: true, message: "Sections updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
