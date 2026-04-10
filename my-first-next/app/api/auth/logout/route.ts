import { NextResponse } from "next/server";

import { appendAdminCookieClear } from "@/lib/auth-tokens";

export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  appendAdminCookieClear(res);
  return res;
}
