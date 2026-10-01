import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = await query(
      `SELECT cm.* 
       FROM contact_messages cm
       JOIN profiles p ON cm.profile_id = p.id
       WHERE p.user_id = $1
       ORDER BY cm.created_at DESC`,
      [session.id]
    );

    return NextResponse.json({ success: true, messages: res.rows });
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
    const { id, status } = body; // status: 'read' | 'archived' | 'spam' | 'new'

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Message ID and status required" }, { status: 400 });
    }

    const res = await query(
      `UPDATE contact_messages
       SET status = $1
       WHERE id = $2 AND profile_id IN (SELECT id FROM profiles WHERE user_id = $3)
       RETURNING *`,
      [status, id, session.id]
    );

    if (!res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: res.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID required" }, { status: 400 });
    }

    const res = await query(
      `DELETE FROM contact_messages
       WHERE id = $1 AND profile_id IN (SELECT id FROM profiles WHERE user_id = $2)
       RETURNING id`,
      [id, session.id]
    );

    if (!res.rowCount || res.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
