import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out." });
  response.cookies.delete("knowaboutme_session");
  return response;
}
