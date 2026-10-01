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

export async function PUT(
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
    const body = await req.json();
    const type = searchParams.get("type") || body.type;
    const data = body.data || body;

    const profRes = await query(`SELECT id FROM profiles WHERE user_id = $1 LIMIT 1`, [session.id]);
    if (!profRes.rowCount || profRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }
    const profileId = profRes.rows[0].id;

    let res;

    if (type === "experience") {
      res = await query(
        `UPDATE experiences
         SET company_name = $1, position = $2, description = $3, location = $4,
             start_date = $5, end_date = $6, is_current = $7, company_url = $8, updated_at = NOW()
         WHERE id = $9 AND profile_id = $10 RETURNING *`,
        [
          data.company_name,
          data.position,
          data.description || null,
          data.location || null,
          data.start_date ? new Date(data.start_date) : null,
          data.end_date ? new Date(data.end_date) : null,
          Boolean(data.is_current),
          data.company_url || null,
          id,
          profileId,
        ]
      );
    } else if (type === "education") {
      res = await query(
        `UPDATE education
         SET institution_name = $1, degree = $2, field_of_study = $3, description = $4,
             location = $5, start_date = $6, end_date = $7, grade = $8, updated_at = NOW()
         WHERE id = $9 AND profile_id = $10 RETURNING *`,
        [
          data.institution_name,
          data.degree || null,
          data.field_of_study || null,
          data.description || null,
          data.location || null,
          data.start_date ? new Date(data.start_date) : null,
          data.end_date ? new Date(data.end_date) : null,
          data.grade || null,
          id,
          profileId,
        ]
      );
    } else if (type === "skills" || type === "skill") {
      res = await query(
        `UPDATE skills
         SET name = $1, category = $2, proficiency = $3, years_experience = $4, updated_at = NOW()
         WHERE id = $5 AND profile_id = $6 RETURNING *`,
        [
          data.name,
          data.category || "General",
          Number(data.proficiency || 80),
          data.years_experience ? Number(data.years_experience) : null,
          id,
          profileId,
        ]
      );
    } else if (type === "projects" || type === "project") {
      const slug = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const techs = Array.isArray(data.technologies)
        ? data.technologies
        : typeof data.technologies === "string"
        ? data.technologies.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];

      res = await query(
        `UPDATE projects
         SET name = $1, slug = $2, description = $3, role = $4, technologies = $5,
             project_url = $6, github_url = $7, cover_image_url = $8, updated_at = NOW()
         WHERE id = $9 AND profile_id = $10 RETURNING *`,
        [
          data.name,
          slug,
          data.description || null,
          data.role || null,
          JSON.stringify(techs),
          data.project_url || null,
          data.github_url || null,
          data.cover_image_url || null,
          id,
          profileId,
        ]
      );
    } else if (type === "artwork") {
      res = await query(
        `UPDATE artwork
         SET title = $1, description = $2, category = $3, image_url = $4, external_url = $5, license = $6, updated_at = NOW()
         WHERE id = $7 AND profile_id = $8 RETURNING *`,
        [
          data.title,
          data.description || null,
          data.category || "Art",
          data.image_url || null,
          data.external_url || null,
          data.license || null,
          id,
          profileId,
        ]
      );
    } else if (type === "hobbies" || type === "hobby") {
      res = await query(
        `UPDATE hobbies
         SET name = $1, category = $2, description = $3, icon = $4, updated_at = NOW()
         WHERE id = $5 AND profile_id = $6 RETURNING *`,
        [
          data.name,
          data.category || null,
          data.description || null,
          data.icon || null,
          id,
          profileId,
        ]
      );
    } else if (type === "achievements" || type === "achievement") {
      res = await query(
        `UPDATE achievements
         SET title = $1, organization = $2, description = $3, achievement_date = $4, credential_url = $5, updated_at = NOW()
         WHERE id = $6 AND profile_id = $7 RETURNING *`,
        [
          data.title,
          data.organization || data.issuer || null,
          data.description || null,
          data.achievement_date || data.date_earned ? new Date(data.achievement_date || data.date_earned) : null,
          data.credential_url || data.certificate_url || null,
          id,
          profileId,
        ]
      );
    } else if (type === "testimonials" || type === "testimonial") {
      res = await query(
        `UPDATE testimonials
         SET name = $1, role = $2, company = $3, message = $4, photo_url = $5, updated_at = NOW()
         WHERE id = $6 AND profile_id = $7 RETURNING *`,
        [
          data.name,
          data.role || null,
          data.company || null,
          data.message,
          data.photo_url || null,
          id,
          profileId,
        ]
      );
    } else if (type === "timeline" || type === "timeline_events") {
      res = await query(
        `UPDATE timeline_events
         SET title = $1, description = $2, event_date = $3, category = $4, icon = $5, updated_at = NOW()
         WHERE id = $6 AND profile_id = $7 RETURNING *`,
        [
          data.title,
          data.description || null,
          data.event_date ? new Date(data.event_date) : null,
          data.category || null,
          data.icon || null,
          id,
          profileId,
        ]
      );
    } else {
      return NextResponse.json({ success: false, error: "Invalid section type" }, { status: 400 });
    }

    if (!res || !res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Item not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: res.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
