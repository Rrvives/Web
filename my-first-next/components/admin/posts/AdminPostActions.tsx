"use client";

import Link from "next/link";

import { DeletePostButton } from "@/components/post/actions/DeletePostButton";

export function AdminPostActions({ postId }: { postId: number }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Link
        href={`/posts/${postId}/edit`}
        className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium dark:border-zinc-600"
      >
        编辑
      </Link>
      <DeletePostButton
        postId={postId}
        compact
        afterDeleteHref="/admin/posts"
      />
    </div>
  );
}
