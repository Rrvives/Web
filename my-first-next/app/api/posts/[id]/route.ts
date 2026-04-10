import { NextResponse } from "next/server";

import { unauthorizedIfNotAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function parseId(param: string): number | null {
  const id = Number.parseInt(param, 10);
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;
  const id = parseId(idParam);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const prisma = getPrisma();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id: idParam } = await context.params;
  const id = parseId(idParam);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: { title?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title =
    body.title !== undefined
      ? typeof body.title === "string"
        ? body.title.trim()
        : null
      : undefined;
  const content =
    body.content !== undefined
      ? typeof body.content === "string"
        ? body.content.trim()
        : null
      : undefined;

  if (title === null || content === null) {
    return NextResponse.json(
      { error: "title and content must be strings when provided" },
      { status: 400 },
    );
  }

  if (title !== undefined && title === "") {
    return NextResponse.json({ error: "title cannot be empty" }, { status: 400 });
  }
  if (content !== undefined && content === "") {
    return NextResponse.json(
      { error: "content cannot be empty" },
      { status: 400 },
    );
  }

  if (title === undefined && content === undefined) {
    return NextResponse.json(
      { error: "Provide at least one of title or content" },
      { status: 400 },
    );
  }

  const prisma = getPrisma();
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const denied = await unauthorizedIfNotAdmin();
  if (denied) return denied;

  const { id: idParam } = await context.params;
  const id = parseId(idParam);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const prisma = getPrisma();
  try {
    await prisma.post.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
