import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CommentSection } from "@/components/post/comments/CommentSection";
import { isAdminFromCookies } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function FloatActionIcon({ kind }: { kind: "like" | "comment" | "collect" | "share" | "warn" | "camera" }) {
  if (kind === "like") return <span className="text-[17px]">👍</span>;
  if (kind === "comment") return <span className="text-[17px]">💬</span>;
  if (kind === "collect") return <span className="text-[17px]">⭐</span>;
  if (kind === "share") return <span className="text-[17px]">↗</span>;
  if (kind === "warn") return <span className="text-[17px]">⚠</span>;
  return <span className="text-[17px]">📷</span>;
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

type Props = { params: Promise<{ id: string }> };

export default async function PostDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (!Number.isFinite(id) || id <= 0) {
    notFound();
  }

  const isAdmin = await isAdminFromCookies();
  const prisma = getPrisma();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    notFound();
  }

  return (
    <main className="w-full bg-[#f4f5f7] py-6">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 px-4 lg:grid-cols-[56px_minmax(0,1fr)_280px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3">
            {[
              { kind: "like", count: 7 },
              { kind: "comment", count: 76 },
              { kind: "collect", count: 18 },
              { kind: "share", count: 0 },
              { kind: "warn", count: 0 },
              { kind: "camera", count: 0 },
            ].map((item) => (
              <button
                key={item.kind}
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm text-zinc-500 shadow-sm"
              >
                <FloatActionIcon kind={item.kind as "like" | "comment" | "collect" | "share" | "warn" | "camera"} />
                {item.count > 0 ? (
                  <span className="absolute -right-1 -top-1 min-w-[16px] rounded-full bg-[#eaf2ff] px-1 text-[10px] font-medium leading-4 text-[#1e80ff]">
                    {item.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </aside>

        <article className="rounded-md border border-zinc-200 bg-white">
          <div className="border-b border-zinc-100 px-6 py-4">
            <h1 className="text-[36px] font-bold leading-tight tracking-tight text-zinc-900">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span>匿名作者</span>
              <time dateTime={post.createdAt.toISOString()}>
                发布于 {formatDate(post.createdAt)}
              </time>
              <time dateTime={post.updatedAt.toISOString()}>
                更新于 {formatDate(post.updatedAt)}
              </time>
            </div>
          </div>

          <div className="px-6 py-7">
            <div className="mb-8 rounded-md border-l-4 border-[#b07df5] bg-[#f6f0ff] p-4 text-zinc-700">
              <p className="text-sm">本周话题推荐</p>
              <p className="mt-2 text-sm leading-7">
                AI 正在重塑开发体验。欢迎分享你的实践、思考与踩坑记录，优质内容会被更多读者看到。
              </p>
            </div>

            <div className="text-[17px] leading-9 text-zinc-800">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-4 text-3xl font-semibold text-zinc-900">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-3 mt-6 text-2xl font-semibold text-zinc-900">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-3 mt-5 text-xl font-semibold text-zinc-900">{children}</h3>
                  ),
                  p: ({ children }) => <p className="mb-3 leading-9 text-zinc-800">{children}</p>,
                  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>,
                  li: ({ children }) => <li className="leading-8 text-zinc-800">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="mb-4 border-l-4 border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-600">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = Boolean(className);
                    if (!isBlock) {
                      return (
                        <code className="rounded bg-zinc-100 px-1 py-0.5 text-[13px] text-zinc-800">
                          {children}
                        </code>
                      );
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
                {post.content}
              </ReactMarkdown>
            </div>
            <div className="mt-8 border-t border-zinc-100 pt-5">
              <p className="text-sm text-zinc-500">标签：</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["前端", "JavaScript", "工程化"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-[#f2f3f5] px-2 py-1 text-xs text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-100 px-6 py-6">
            <CommentSection postId={post.id} isAdmin={isAdmin} />
          </div>
        </article>

        <aside className="space-y-4">
          <section className="rounded-md border border-zinc-200 bg-white p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2e74ff] to-[#64a6ff]" />
              <div>
                <p className="font-semibold text-zinc-900">匿名作者</p>
                <p className="text-xs text-zinc-400">持续分享技术内容</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-zinc-500">
              <div>
                <p className="text-base font-semibold text-zinc-900">1</p>
                <p>文章</p>
              </div>
              <div>
                <p className="text-base font-semibold text-zinc-900">0</p>
                <p>阅读</p>
              </div>
              <div>
                <p className="text-base font-semibold text-zinc-900">0</p>
                <p>粉丝</p>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-zinc-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">目录</h3>
              <span className="text-xs text-zinc-400">收起</span>
            </div>
            <ul className="max-h-[260px] space-y-2 overflow-auto text-sm text-zinc-600">
              <li>文章概述</li>
              <li>核心内容</li>
              <li>实践建议</li>
              <li>总结</li>
              <li>评论区</li>
            </ul>
          </section>
          <section className="rounded-md border border-zinc-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-zinc-900">相关推荐</h3>
            <ul className="space-y-3 text-sm text-zinc-700">
              <li className="line-clamp-2">别再让 JavaScript 把 CSS 的活儿干了，布局实战总结</li>
              <li className="line-clamp-2">可吞噬华为与阿里巴巴进行比较，你怎么看工程体系</li>
              <li className="line-clamp-2">写了个 git 提交脚本，再也不用命令行了</li>
              <li className="line-clamp-2">图片懒加载：让你的网页飞起来</li>
            </ul>
          </section>
        </aside>
      </div>
      <div className="fixed bottom-8 right-5 z-20 space-y-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm"
        >
          <span className="text-[18px] text-[#1e80ff]">🤖</span>
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm"
        >
          <span className="text-[16px] text-zinc-500">💬</span>
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm"
        >
          <span className="text-[16px] text-zinc-500">↑</span>
        </button>
      </div>
    </main>
  );
}
