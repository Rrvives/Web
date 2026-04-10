"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props =
  | { mode: "create"; postId?: never; initialTitle?: never; initialContent?: never }
  | {
      mode: "edit";
      postId: number;
      initialTitle: string;
      initialContent: string;
    };

export function PostForm(props: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(
    props.mode === "edit" ? props.initialTitle : "",
  );
  const [content, setContent] = useState(
    props.mode === "edit" ? props.initialContent : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (props.mode === "create") {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "创建失败");
          return;
        }
        router.push(`/posts/${data.id}`);
        router.refresh();
        return;
      }

      const res = await fetch(`/api/posts/${props.postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "保存失败");
        return;
      }
      router.push(`/posts/${props.postId}`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {error ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="post-title" className="text-sm font-medium">
          标题
        </label>
        <input
          id="post-title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="post-content" className="text-sm font-medium">
          正文
        </label>
        <textarea
          id="post-content"
          name="content"
          required
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {pending ? "提交中…" : props.mode === "create" ? "发布" : "保存"}
        </button>
      </div>
    </form>
  );
}
