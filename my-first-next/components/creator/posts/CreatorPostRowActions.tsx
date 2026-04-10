"use client";

import Link from "next/link";
import { useState } from "react";

import { DeletePostButton } from "@/components/post/actions/DeletePostButton";

export function CreatorPostRowActions({ postId }: { postId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded px-2 py-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
      >
        ...
      </button>
      {open ? (
        <div className="absolute right-0 top-9 z-20 min-w-[92px] rounded-md border border-zinc-200 bg-white py-1 shadow-md">
          <Link
            href={`/posts/${postId}/edit`}
            className="block px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            编辑
          </Link>
          <div className="px-3 py-1.5">
            <DeletePostButton postId={postId} compact afterDeleteHref="/creator" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
