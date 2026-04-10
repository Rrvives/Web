import { notFound } from "next/navigation";

import { WritePostEditor } from "@/components/post/editor/WritePostEditor";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const prisma = getPrisma();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    notFound();
  }

  return (
    <WritePostEditor
      mode="edit"
      postId={post.id}
      initialTitle={post.title}
      initialContent={post.content}
    />
  );
}
