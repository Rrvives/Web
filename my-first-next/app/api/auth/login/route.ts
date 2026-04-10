import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

import { appendAdminCookie, signAdminToken } from "@/lib/auth-tokens";

export const dynamic = "force-dynamic";

/** 密码 `123456` 的 bcrypt（Base64）。仅当 NODE_ENV=development 且未配置 ADMIN_PASSWORD_* 时使用 */
const DEV_DEFAULT_ADMIN_BCRYPT_B64 =
  "JDJiJDEwJDZHZjA1aXEwclZ3R0pxaGdGYW82UE8wckRoS2tQLllGNTRmcDJkY3J5eWl1NXltUGwwZFNh";

const BCRYPT_60 =
  /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

/** 从环境变量原始字符串中抠出标准 bcrypt 哈希（60 字符） */
function extractBcryptHash(raw: string): string | null {
  let s = raw.trim().replace(/\r/g, "").replace(/^\uFEFF/, "");

  // 剥掉一层外层引号（ASCII / 弯引号），兼容解析器把引号留在值里的情况
  for (let i = 0; i < 3; i++) {
    const t = s.trim();
    if (
      (t.startsWith("'") && t.endsWith("'")) ||
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("\u2018") && t.endsWith("\u2019")) ||
      (t.startsWith("\u201C") && t.endsWith("\u201D"))
    ) {
      s = t.slice(1, -1).trim();
      continue;
    }
    break;
  }

  const m = s.match(/\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}/);
  if (m) return m[0];

  const idx = s.indexOf("$2");
  if (idx >= 0) {
    const chunk = s.slice(idx, idx + 60);
    if (BCRYPT_60.test(chunk)) return chunk;
  }

  if (BCRYPT_60.test(s)) return s;

  return null;
}

function stripOuterQuotes(value: string): string {
  let s = value.trim();
  for (let i = 0; i < 3; i++) {
    if (
      (s.startsWith("'") && s.endsWith("'")) ||
      (s.startsWith('"') && s.endsWith('"'))
    ) {
      s = s.slice(1, -1).trim();
      continue;
    }
    break;
  }
  return s;
}

function readAdminPasswordHashRaw(): string {
  const plain = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (plain) return plain;

  const b64Raw = process.env.ADMIN_PASSWORD_HASH_B64?.trim();
  if (b64Raw) {
    const b64 = stripOuterQuotes(b64Raw);
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8");
      if (decoded) return decoded;
    } catch {
      /* fall through */
    }
  }

  if (process.env.NODE_ENV === "development") {
    try {
      return Buffer.from(DEV_DEFAULT_ADMIN_BCRYPT_B64, "base64").toString(
        "utf8",
      );
    } catch {
      return "";
    }
  }

  return "";
}

export async function POST(request: Request) {
  const rawHash = readAdminPasswordHashRaw();
  if (!rawHash.trim()) {
    return NextResponse.json(
      {
        error:
          "未配置管理员密码哈希。请在 .env 设置 ADMIN_PASSWORD_HASH_B64，或在开发环境使用内置默认密码 123456（需 NODE_ENV=development）。",
      },
      { status: 500 },
    );
  }

  const hash = extractBcryptHash(rawHash);
  if (!hash) {
    return NextResponse.json(
      {
        error:
          "无法从 ADMIN_PASSWORD_HASH 中识别 bcrypt 哈希。请确认共 60 字符且以 $2b$10$ 开头；可改用无引号一行，或执行 echo -n '$2b$10$完整60字符' | base64 将结果写入 ADMIN_PASSWORD_HASH_B64= 后重启。",
      },
      { status: 500 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password =
    typeof body.password === "string" ? body.password.trim() : "";
  if (!password) {
    return NextResponse.json({ error: "password required" }, { status: 400 });
  }

  const ok = await compare(password, hash);
  if (!ok) {
    return NextResponse.json(
      {
        error:
          "密码错误。若确定密码无误，请检查 .env：bcrypt 哈希须用单引号包裹（勿用双引号，否则 $ 会被错误解析），改完后重启 npm run dev。",
      },
      { status: 401 },
    );
  }

  let token: string;
  try {
    token = await signAdminToken();
  } catch {
    return NextResponse.json(
      { error: "ADMIN_JWT_SECRET 未正确配置" },
      { status: 500 },
    );
  }

  const res = NextResponse.json({ ok: true });
  appendAdminCookie(res, token);
  return res;
}
