import { NextResponse } from "next/server";

import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function parsePostId(param: string): number | null {
  const id = Number.parseInt(param, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;
  const postId = parsePostId(idParam);
  if (postId === null) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  const prisma = getPrisma();
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;
  const postId = parsePostId(idParam);
  if (postId === null) {
    return NextResponse.json({ error: "Invalid post id" }, { status: 400 });
  }

  let body: { author?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawAuthor =
    typeof body.author === "string" ? body.author.trim() : "匿名";
  const author =
    rawAuthor.length > 191 ? rawAuthor.slice(0, 191) : rawAuthor || "匿名";
  const content =
    typeof body.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "content 不能为空" }, { status: 400 });
  }

  const prisma = getPrisma();
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { postId, author, content },
  });
  return NextResponse.json(comment, { status: 201 });
}
