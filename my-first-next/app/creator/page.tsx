import Link from "next/link";

import { CreatorPostRowActions } from "@/components/creator/posts/CreatorPostRowActions";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const menuGroups = [
  { title: "", items: ["首页"] },
  { title: "内容管理", items: ["文章管理", "专栏管理", "沸点管理", "AI作品管理"] },
  { title: "数据中心", items: ["内容数据", "粉丝数据"] },
  { title: "创作成长", items: ["创作等级权益", "创作灵感"] },
  { title: "创作工具", items: ["文章导入发布"] },
] as const;

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export default async function CreatorPage() {
  const prisma = getPrisma();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
    take: 50,
  });

  return (
    <main className="w-full bg-[#f4f5f7] py-5">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 px-4 lg:grid-cols-[160px_minmax(0,1fr)]">
        <aside className="rounded-md bg-white p-3">
          <Link
            href="/posts/new"
            className="mb-2 block w-full rounded-md bg-[#1e80ff] py-2 text-center text-sm font-medium text-white"
          >
            写文章
          </Link>
          {menuGroups.map((group, idx) => (
            <section key={group.title || `group-${idx}`} className="mt-2 border-t border-zinc-100 pt-2 first:mt-0 first:border-none first:pt-0">
              {group.title ? <h3 className="mb-1 px-2 text-xs text-zinc-400">{group.title}</h3> : null}
              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <li
                    key={item}
                    className={`rounded-md px-2 py-1.5 text-sm ${
                      idx === 1 && itemIndex === 0
                        ? "bg-[#eaf2ff] text-[#1e80ff]"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </aside>

        <section className="rounded-md bg-white">
          <div className="border-b border-zinc-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h2 className="border-b-2 border-[#1e80ff] pb-2 text-[16px] font-semibold text-zinc-900">
                  文章
                </h2>
                <span className="pb-2 text-[16px] text-zinc-400">草稿箱({posts.length})</span>
              </div>
              <div className="w-[260px] rounded-md border border-zinc-200 px-3 py-1.5 text-sm text-zinc-400">
                请输入标题关键词
              </div>
            </div>
          </div>
          <div className="border-b border-zinc-100 px-4 py-2 text-sm">
            <span className="mr-6 text-[#1e80ff]">全部（{posts.length}）</span>
            <span className="mr-6 text-zinc-500">已发布（{posts.length}）</span>
            <span className="mr-6 text-zinc-500">审核中（0）</span>
            <span className="text-zinc-500">未通过（0）</span>
          </div>
          <ul>
            {posts.length === 0 ? (
              <li className="px-4 py-12 text-center text-sm text-zinc-500">
                暂无文章，点击左上角“写文章”开始创作。
              </li>
            ) : (
              posts.map((post: (typeof posts)[number]) => (
                <li
                  key={post.id}
                  className="flex items-start justify-between border-b border-zinc-100 px-4 py-4 last:border-b-0"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <Link
                      href={`/posts/${post.id}`}
                      className="line-clamp-1 text-[20px] font-medium text-zinc-900 hover:text-[#1e80ff]"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-2 text-xs text-zinc-400">
                      {formatDate(post.createdAt)} · {Math.max(100, post.id * 23)}展现 · {Math.max(0, post.id * 3)}
                      阅读 · {Math.max(0, post.id % 6)}点赞 · {post._count.comments}评论 ·{" "}
                      {Math.max(0, post.id % 4)}收藏
                    </p>
                  </div>
                  <CreatorPostRowActions postId={post.id} />
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
