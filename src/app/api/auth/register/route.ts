import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
    }

    const { email, password, username, displayName } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = username.toLowerCase().trim();

    // 1. Check existing email
    const emailCheck = await query(`SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`, [cleanEmail]);
    if (emailCheck.rowCount && emailCheck.rowCount > 0) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 409 });
    }

    // 2. Check existing username
    const usernameCheck = await query(`SELECT id FROM profiles WHERE LOWER(username) = LOWER($1) LIMIT 1`, [cleanUsername]);
    if (usernameCheck.rowCount && usernameCheck.rowCount > 0) {
      return NextResponse.json({ success: false, error: "This username is already taken. Please choose another." }, { status: 409 });
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create User
    const userRes = await query(
      `INSERT INTO users (id, email, password_hash, role, status, email_verified_at, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, 'user', 'active', NOW(), NOW(), NOW())
       RETURNING id, email, role`,
      [cleanEmail, passwordHash]
    );

    const newUser = userRes.rows[0];

    // 5. Create Profile
    const profileRes = await query(
      `INSERT INTO profiles (
         id, user_id, username, display_name, headline, profile_type,
         profile_status, is_verified, theme_id, accent_color, font_family,
         created_at, updated_at
       ) VALUES (
         gen_random_uuid(), $1, $2, $3, 'Digital Storyteller & Creator', 'personal',
         'published', false, 'creative', '#6366f1', 'sans', NOW(), NOW()
       )
       RETURNING id, username, display_name`,
      [newUser.id, cleanUsername, displayName.trim()]
    );

    const newProfile = profileRes.rows[0];

    // 6. Create Profile Settings
    await query(
      `INSERT INTO profile_settings (id, profile_id, show_email, allow_contact, show_social_links, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, true, true, true, NOW(), NOW())`,
      [newProfile.id]
    );

    // 7. Initialize default sections
    const defaultSections = [
      "about", "experience", "projects", "skills", "education", "social_links", "contact"
    ];
    for (let i = 0; i < defaultSections.length; i++) {
      await query(
        `INSERT INTO profile_sections (id, profile_id, section_type, display_order, is_visible, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, true, NOW(), NOW())`,
        [newProfile.id, defaultSections[i], i + 1]
      );
    }

    // 8. Sign JWT and set cookie
    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      profileId: newProfile.id,
      username: newProfile.username,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newProfile.username,
          displayName: newProfile.display_name,
        },
      },
      { status: 201 }
    );

    response.cookies.set("knowaboutme_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to register" }, { status: 500 });
  }
}
