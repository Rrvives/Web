import { NextResponse } from "next/server";

import { unauthorizedIfNotAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const prisma = getPrisma();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  let body: { title?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!title || !content) {
    return NextResponse.json(
      { error: "title and content are required non-empty strings" },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  const post = await prisma.post.create({
    data: { title, content },
  });

  return NextResponse.json(post, { status: 201 });
}
