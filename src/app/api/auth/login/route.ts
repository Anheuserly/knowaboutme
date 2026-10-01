import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();

    // 1. Fetch user with profile
    const userRes = await query(
      `SELECT u.id, u.email, u.password_hash, u.role, u.status, p.id as profile_id, p.username, p.display_name
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE LOWER(u.email) = LOWER($1)
       LIMIT 1`,
      [cleanEmail]
    );

    if (!userRes.rowCount || userRes.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    const user = userRes.rows[0];

    if (user.status === "suspended") {
      return NextResponse.json({ success: false, error: "This account has been suspended." }, { status: 403 });
    }

    // 2. Verify password
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
    }

    // 3. Update last login
    await query(`UPDATE users SET last_login_at = NOW() WHERE id = $1`, [user.id]);

    // 4. Sign JWT
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      profileId: user.profile_id,
      username: user.username,
    });

    const response = NextResponse.json({
      success: true,
      message: "Authenticated successfully.",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
        displayName: user.display_name,
      },
    });

    response.cookies.set("knowaboutme_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: error.message || "Login failed" }, { status: 500 });
  }
}
