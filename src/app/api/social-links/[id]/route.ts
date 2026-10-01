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

    const res = await query(
      `DELETE FROM social_links 
       WHERE id = $1 AND profile_id IN (SELECT id FROM profiles WHERE user_id = $2)
       RETURNING id`,
      [id, session.id]
    );

    if (!res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Link not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Link deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
