"use client";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo, useState } from "react";

const toolbarItems = [
  "H",
  "B",
  "I",
  "“”",
  "🔗",
  "🖼",
  "</>",
  "•",
  "1.",
  "Σ",
  "☑",
];

type WritePostEditorProps =
  | {
      mode?: "create";
      postId?: never;
      initialTitle?: string;
      initialContent?: string;
    }
  | {
      mode: "edit";
      postId: number;
      initialTitle: string;
      initialContent: string;
    };

export function WritePostEditor(props: WritePostEditorProps) {
  const router = useRouter();
  const mode = props.mode ?? "create";
  const [title, setTitle] = useState(props.initialTitle ?? "");
  const [content, setContent] = useState(props.initialContent ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    if (!content.trim()) return "";
    return content;
  }, [content]);

  async function onSubmit() {
    if (!title.trim() || !content.trim()) {
      setError("请先填写标题和正文");
      return;
    }

    setError(null);
    setPending(true);
    try {
      const res =
        mode === "edit"
          ? await fetch(`/api/posts/${props.postId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title, content }),
              credentials: "include",
            })
          : await fetch("/api/posts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title, content }),
              credentials: "include",
            });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : mode === "edit" ? "保存失败" : "发布失败");
        return;
      }
      const targetId = mode === "edit" ? props.postId : data.id;
      router.push(`/posts/${targetId}`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  function onBack() {
    router.back();
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <div className="flex h-14 items-center border-b border-zinc-200 px-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入文章标题..."
          className="w-full min-w-0 border-none bg-transparent text-[32px] font-semibold leading-none text-zinc-900 outline-none placeholder:text-zinc-300"
        />
        <div className="ml-4 flex shrink-0 items-center gap-2 text-sm">
          <span className="inline-flex h-10 items-center rounded-md bg-[#f2f3f5] px-2 text-[14px] leading-tight text-[#1e80ff]">
            # 每天一个知识点
          </span>
          <span className="w-8 text-center text-[13px] leading-4 text-zinc-400">
            保存
            <br />
            成功
          </span>
          <button
            type="button"
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-[16px] leading-4 text-zinc-700 hover:bg-zinc-50"
          >
            草稿
            <br />
            箱
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onSubmit}
            className="h-10 rounded-md bg-[#1e80ff] px-4 text-[16px] font-medium leading-4 text-white disabled:opacity-60"
          >
            {pending ? (
              mode === "edit" ? (
                "更新中"
              ) : (
                "发布中"
              )
            ) : mode === "edit" ? (
              <>
                更新
              </>
            ) : (
              <>
                发布
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
            aria-label="返回上一页"
            title="返回上一页"
          >
            ↩
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ff9f6c] to-[#9d4dff]" />
        </div>
      </div>

      <div className="flex h-10 items-center gap-2 border-b border-zinc-200 px-6 text-[14px] text-zinc-600">
        {toolbarItems.map((item) => (
          <button
            key={item}
            type="button"
            className="flex h-6 min-w-6 items-center justify-center rounded px-1 leading-none hover:bg-zinc-100 hover:text-zinc-900"
          >
            {item}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-zinc-400">
          {["☰", "⌗", "🖼", "☐", "↔", "↻"].map((item) => (
            <button
              key={item}
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded text-[16px] hover:bg-zinc-100"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mx-6 mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid flex-1 grid-cols-1 divide-y divide-zinc-200 md:grid-cols-2 md:divide-x md:divide-y-0">
        <section className="bg-[#f8f9fa]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"# 功能点\n\n- 支持 Markdown 实时预览\n- 支持标题、列表、代码块\n\n```ts\nconst hello = 'world'\n```"}
            className="h-full min-h-[520px] w-full resize-none border-none bg-transparent p-6 text-[15px] leading-8 text-zinc-800 outline-none placeholder:text-zinc-400"
          />
        </section>
        <section className="bg-white p-8 text-[15px] leading-8 text-zinc-700">
          {preview ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="mb-4 text-3xl font-semibold text-zinc-900">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-3 mt-6 text-2xl font-semibold text-zinc-900">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-3 mt-5 text-xl font-semibold text-zinc-900">{children}</h3>,
                p: ({ children }) => <p className="mb-3 leading-8 text-zinc-700">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>,
                li: ({ children }) => <li className="leading-8 text-zinc-700">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="mb-4 border-l-4 border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-600">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isBlock = Boolean(className);
                  if (!isBlock) {
                    return <code className="rounded bg-zinc-100 px-1 py-0.5 text-[13px] text-zinc-800">{children}</code>;
                  }
                  return (
                    <code className="mb-4 block overflow-x-auto rounded-md bg-zinc-900 p-4 text-[13px] leading-6 text-zinc-100">
                      {children}
                    </code>
                  );
                },
                hr: () => <hr className="my-6 border-zinc-200" />,
              }}
            >
              {preview}
            </ReactMarkdown>
          ) : (
            <p className="text-zinc-400">预览区</p>
          )}
        </section>
      </div>

      <div className="flex h-8 items-center justify-between border-t border-zinc-200 px-6 text-xs text-zinc-400">
        <span>字符数: {content.length}　行数: {content.split("\n").length}　正文字符数: {content.trim().length}</span>
        <span>☑ 同步滚动　回到顶部</span>
      </div>
    </div>
  );
}
