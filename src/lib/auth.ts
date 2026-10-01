import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET =
  process.env.AUTH_SECRET ||
  process.env.JWT_SECRET ||
  "knowaboutme_super_secret_auth_jwt_key_2026_identity_platform";

export type SessionUser = {
  id: string;
  email: string;
  role: "super_admin" | "admin" | "moderator" | "user";
  profileId?: string;
  username?: string;
};

export function signToken(payload: SessionUser, expiresIn: string = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("knowaboutme_session")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: Request): SessionUser | null {
  try {
    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) return null;
    const cookiesArr = cookieHeader.split(";").map((c) => c.trim());
    const sessionCookie = cookiesArr.find((c) => c.startsWith("knowaboutme_session="));
    if (!sessionCookie) return null;
    const token = sessionCookie.split("=")[1];
    return verifyToken(token);
  } catch {
    return null;
  }
}
