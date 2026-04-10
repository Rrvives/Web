import Link from "next/link";

import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const prisma = getPrisma();
  const [postCount, commentCount] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">概览</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          文章 {postCount} 篇 · 评论 {commentCount} 条
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        <li>
          <Link
            href="/admin/posts"
            className="block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <span className="font-medium">管理文章</span>
            <p className="mt-1 text-xs text-zinc-500">编辑、删除、跳转前台</p>
          </Link>
        </li>
        <li>
          <Link
            href="/posts/new"
            className="block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
          >
            <span className="font-medium">发布新文章</span>
            <p className="mt-1 text-xs text-zinc-500">创建博客正文</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
