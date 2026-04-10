import Link from "next/link";

import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default async function PostsPage() {
  const prisma = getPrisma();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">文章列表</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            服务端渲染，按创建时间倒序
          </p>
        </div>
        <Link
          href="/posts/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          写文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          暂无文章。{" "}
          <Link href="/posts/new" className="font-medium text-zinc-900 underline dark:text-zinc-100">
            创建第一篇
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/posts/${post.id}`}
                className="block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <span className="font-medium">{post.title}</span>
                <time
                  className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400"
                  dateTime={post.createdAt.toISOString()}
                >
                  {formatDate(post.createdAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
