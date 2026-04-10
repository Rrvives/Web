import { SignJWT, jwtVerify } from "jose";
import type { NextResponse } from "next/server";

export const ADMIN_COOKIE = "admin_session";

function getJwtSecretBytes(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_JWT_SECRET 未配置或长度不足 16，请在 .env 中设置随机字符串",
    );
  }
  return new TextEncoder().encode(s);
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecretBytes());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** 供 Edge middleware 使用：缺密钥时返回 false */
export async function verifyAdminTokenSafe(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    const s = process.env.ADMIN_JWT_SECRET;
    if (!s || s.length < 16) return false;
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(s),
    );
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function appendAdminCookieClear(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export function appendAdminCookie(res: NextResponse, token: string): void {
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
