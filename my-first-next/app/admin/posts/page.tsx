import Link from "next/link";

import { AdminPostActions } from "@/components/admin/posts/AdminPostActions";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminPostsPage() {
  const prisma = getPrisma();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { comments: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">文章管理</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            共 {posts.length} 篇
          </p>
        </div>
        <Link
          href="/posts/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-zinc-500">暂无文章</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 dark:bg-zinc-950"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/posts/${post.id}`}
                  className="font-medium hover:underline"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {formatDate(post.createdAt)} · {post._count.comments} 条评论
                </p>
              </div>
              <AdminPostActions postId={post.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
