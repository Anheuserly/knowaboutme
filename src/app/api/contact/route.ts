import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { contactFormSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, name, email, subject, message } = body;

    if (!profileId) {
      return NextResponse.json({ success: false, error: "Profile ID is required" }, { status: 400 });
    }

    const parsed = contactFormSchema.safeParse({ name, email, subject, message });
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    // Insert message into contact_messages
    await query(
      `INSERT INTO contact_messages (id, profile_id, sender_name, sender_email, subject, message, status, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'new', NOW())`,
      [profileId, parsed.data.name, parsed.data.email, parsed.data.subject || "Inquiry from KnowAboutMe", parsed.data.message]
    );

    return NextResponse.json({ success: true, message: "Your message has been delivered." });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
