"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CommentForm({ postId }: { postId: number }) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim() || undefined,
          content: content.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "发表失败");
        return;
      }
      setContent("");
      setAuthor("");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-start gap-3 rounded-md bg-[#f7f8fa] p-3">
      <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-[#ff9d72] to-[#8f5bff]" />
      <div className="min-w-0 flex-1">
        {error ? (
          <p className="mb-2 text-sm text-red-600">{error}</p>
        ) : null}
        <div className="rounded-md border border-[#d9dce3] bg-white px-3 py-2">
          <input
            type="text"
            placeholder="昵称（可选）"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={191}
            className="mb-2 w-full border-none bg-transparent text-[13px] text-zinc-500 outline-none placeholder:text-zinc-400"
          />
          <textarea
            required
            rows={3}
            placeholder="平等表达，友善交流"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none border-none bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
          />
          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2">
            <div className="text-xs text-zinc-400">😊 📷</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">{content.length} / 1000</span>
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-[#1e80ff] px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
              >
                {pending ? "发送中" : "发送"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
