"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({
  postId,
  compact,
  afterDeleteHref = "/posts",
}: {
  postId: number;
  compact?: boolean;
  /** 删除成功后的跳转路径 */
  afterDeleteHref?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!window.confirm("确定删除这篇文章？此操作不可恢复。")) {
      return;
    }
    setPending(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(
          typeof data.error === "string" ? data.error : "删除失败",
        );
        return;
      }
      router.push(afterDeleteHref);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const btnClass = compact
    ? "rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/70"
    : "rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/70";

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className={btnClass}
    >
      {pending ? "删除中…" : "删除"}
    </button>
  );
}
