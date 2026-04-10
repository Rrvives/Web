import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth-tokens";

export {
  ADMIN_COOKIE,
  appendAdminCookie,
  appendAdminCookieClear,
  signAdminToken,
  verifyAdminToken,
  verifyAdminTokenSafe,
} from "@/lib/auth-tokens";

export async function isAdminFromCookies(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export async function unauthorizedIfNotAdmin(): Promise<NextResponse | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
