import Link from "next/link";

import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function MenuIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-[14px] w-[14px] ${active ? "text-[#1e80ff]" : "text-zinc-400"}`}>
      <circle cx="8" cy="8" r="5.25" fill="currentColor" opacity={active ? "1" : "0.18"} />
      <circle cx="8" cy="8" r="2.1" fill="currentColor" />
    </svg>
  );
}

function CoverThumb({ tone }: { tone: "purple" | "blue" | "indigo" | "dark" }) {
  const map = {
    purple: "from-[#9f96ff] via-[#8d79ff] to-[#6e56f9]",
    blue: "from-[#7fb8ff] via-[#5aa4ff] to-[#2f82ff]",
    indigo: "from-[#8aa9ff] via-[#7d87ff] to-[#4f5fe8]",
    dark: "from-[#666b78] via-[#525966] to-[#393f4b]",
  } as const;
  return (
    <div className={`relative h-[72px] w-[120px] shrink-0 overflow-hidden rounded-sm border border-zinc-100 bg-gradient-to-br ${map[tone]}`}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,#ffffff24_30%,#ffffff24_34%,transparent_34%,transparent_46%,#ffffff1f_46%,#ffffff1f_50%,transparent_50%)]" />
      <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-[#00000033] to-transparent" />
      <span className="absolute bottom-1 left-2 text-[11px] font-medium text-white">封面</span>
    </div>
  );
}

function ActionIcon({ kind }: { kind: "chat" | "help" | "more" }) {
  if (kind === "chat") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#1e80ff]">
        <path
          fill="currentColor"
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7A2.5 2.5 0 0 1 17.5 15H10l-4.5 4v-4A2.5 2.5 0 0 1 4 12.5z"
        />
      </svg>
    );
  }
  if (kind === "help") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-zinc-500">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2m.2 15.6h-1.8v-1.8h1.8Zm2.2-6.9-.8.8a2.9 2.9 0 0 0-1 2.2h-1.8a4.5 4.5 0 0 1 1.3-3.4l1.1-1.1a1.7 1.7 0 0 0-1.2-2.9 1.7 1.7 0 0 0-1.7 1.7H8.5a3.5 3.5 0 1 1 6 2.7"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-zinc-500">
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function RankNumber({ value }: { value: number }) {
  const color =
    value === 1 ? "text-[#f53f3f]" : value === 2 ? "text-[#ff7d00]" : value === 3 ? "text-[#ff9a2e]" : "text-zinc-400";
  return <span className={`mt-0.5 text-xs font-semibold ${color}`}>{value}</span>;
}

function MetaIcon({ type }: { type: "view" | "comment" | "time" }) {
  if (type === "view") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-zinc-400">
        <path
          fill="currentColor"
          d="M8 3C4.2 3 1.5 6.1 1 7.9a.6.6 0 0 0 0 .2c.5 1.8 3.2 4.9 7 4.9s6.5-3.1 7-4.9a.6.6 0 0 0 0-.2C14.5 6.1 11.8 3 8 3m0 8.2A3.2 3.2 0 1 1 8 4.8a3.2 3.2 0 0 1 0 6.4m0-5A1.8 1.8 0 1 0 8 9.8a1.8 1.8 0 0 0 0-3.6"
        />
      </svg>
    );
  }
  if (type === "comment") {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-zinc-400">
        <path
          fill="currentColor"
          d="M8 2C4.1 2 1 4.4 1 7.3c0 1.5.8 2.8 2.1 3.7l-.4 2a.5.5 0 0 0 .7.6L6.1 12c.6.2 1.2.3 1.9.3 3.9 0 7-2.4 7-5.3S11.9 2 8 2"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-zinc-400">
      <path
        fill="currentColor"
        d="M8 1.7a6.3 6.3 0 1 0 6.3 6.3A6.3 6.3 0 0 0 8 1.7m.7 6.6V4.9H7.3v4l2.8 1.6.7-1.1z"
      />
    </svg>
  );
}

function excerptOf(content: string) {
  const clean = content.replace(/\s+/g, " ").trim();
  if (!clean) return "暂无摘要";
  return clean.length > 74 ? `${clean.slice(0, 74)}...` : clean;
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))}分钟前`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}小时前`;
  return `${Math.floor(diffMs / day)}天前`;
}

const channelFilters: Record<string, string[]> = {
  后端: ["后端", "接口", "数据库", "sql", "mysql", "java", "go", "node"],
  前端: ["前端", "react", "next", "vue", "css", "typescript", "js"],
  Android: ["android", "kotlin", "java", "移动端"],
  iOS: ["ios", "swift", "objective-c", "移动端"],
  人工智能: ["ai", "人工智能", "llm", "模型", "agent", "大模型"],
  开发工具: ["工具", "效率", "vscode", "cursor", "cli", "debug"],
  代码人生: ["成长", "职场", "面试", "人生", "思考"],
  阅读: ["阅读", "书", "总结", "周刊"],
  排行榜: ["热门", "趋势", "star", "top", "榜"],
};

type HomeProps = {
  searchParams: Promise<{
    channel?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const channels = [
    { name: "关注" },
    { name: "综合" },
    { name: "后端" },
    { name: "前端" },
    { name: "Android" },
    { name: "iOS" },
    { name: "人工智能" },
    { name: "开发工具" },
    { name: "代码人生" },
    { name: "阅读" },
    { name: "排行榜" },
  ] as const;
  const rankList = [
    "Claude Code 的 skills 源码解析",
    "AI 时代的管理后台框架，应该怎么选",
    "一周狂揽40k+ Star 的实战项目",
    "抖音“极客”适配 Android 5 - 9",
    "你的 AI 不好用，可能是它在偷懒",
  ];
  const prisma = getPrisma();
  const sp = await searchParams;
  const currentChannel =
    typeof sp.channel === "string" &&
    channels.some((item) => item.name === sp.channel)
      ? sp.channel
      : "综合";
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
    take: 20,
  });
  const filteredPosts = posts.filter((post: (typeof posts)[number]) => {
    if (currentChannel === "综合") return true;
    if (currentChannel === "关注") return true;
    const text = `${post.title} ${post.content}`.toLowerCase();
    const keys = channelFilters[currentChannel];
    if (!keys?.length) return true;
    return keys.some((k) => text.includes(k.toLowerCase()));
  });

  return (
    <main className="w-full bg-[#f4f5f5] py-4">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-4 px-4 lg:grid-cols-[164px_minmax(0,1fr)_250px]">
        <aside className="rounded-md bg-white p-3">
          <ul className="space-y-0.5">
            {channels.map((item, index) => (
              <li key={item.name}>
                <Link
                  href={item.name === "综合" ? "/" : `/?channel=${encodeURIComponent(item.name)}`}
                  className={`flex items-center gap-2 rounded-md px-3 py-[9px] text-[14px] transition ${
                    currentChannel === item.name ||
                    (item.name === "综合" && currentChannel === "综合")
                      ? "bg-[#eaf2ff] font-medium text-[#1e80ff]"
                      : "text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <MenuIcon active={currentChannel === item.name || (item.name === "综合" && currentChannel === "综合")} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <section className="overflow-hidden rounded-md border border-[#e4e6eb] bg-white">
          <div className="flex border-b border-zinc-100 px-4">
            <button
              type="button"
              className="border-b-2 border-[#1e80ff] px-1 py-3 text-[15px] font-medium text-zinc-900"
            >
              推荐
            </button>
            <button type="button" className="ml-5 px-1 py-3 text-[15px] text-zinc-400">
              最新
            </button>
          </div>
          {filteredPosts.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <p className="text-sm text-zinc-500">
                当前频道暂无文章，试试切换到“综合”或发布新内容。
              </p>
              <Link
                href="/posts/new"
                className="mt-4 inline-flex rounded-md bg-[#1e80ff] px-4 py-2 text-sm font-medium text-white"
              >
                写文章
              </Link>
            </div>
          ) : (
            <ul>
              {filteredPosts.map((post: (typeof filteredPosts)[number], index: number) => (
                <li key={post.id} className="border-b border-zinc-100 px-4 py-3.5 last:border-b-0">
                  <Link href={`/posts/${post.id}`} className="flex min-h-[118px] items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-[20px] font-semibold leading-[1.35] tracking-tight text-zinc-900">
                        {post.title}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-[12px] text-zinc-400">
                        掘金一周刊
                      </p>
                      <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-zinc-500">
                        {excerptOf(post.content)}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-[12px] text-zinc-400">
                        <span>前端</span>
                        <span>AI编程</span>
                        <span>沸点周刊</span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[12px] text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <MetaIcon type="view" />
                          <span>{Math.max(88, post.id * 9)}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MetaIcon type="comment" />
                          <span>{post._count.comments}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MetaIcon type="time" />
                          <span>{formatRelativeTime(post.createdAt)}</span>
                        </span>
                      </div>
                    </div>
                    <CoverThumb tone={index % 4 === 0 ? "indigo" : index % 4 === 1 ? "blue" : index % 4 === 2 ? "purple" : "dark"} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-3">
          <section className="rounded-md border border-[#e4e6eb] bg-white p-3">
            <p className="text-[30px] font-semibold leading-none text-zinc-900">下午好！</p>
            <p className="mt-2 text-sm text-zinc-400">点亮社区的一天</p>
            <button
              type="button"
              className="mt-3 rounded-md border border-[#b8d8ff] px-3 py-1 text-sm text-[#1e80ff]"
            >
              去签到
            </button>
          </section>
          <section className="rounded-md border border-[#e4e6eb] bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold text-zinc-900">文章榜</h3>
              <span className="text-xs text-zinc-400">换一换</span>
            </div>
            <ol className="space-y-2">
              {rankList.map((item, idx) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <RankNumber value={idx + 1} />
                  <span className="line-clamp-1 text-zinc-600">{item}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-center text-xs text-zinc-400">查看更多</p>
          </section>
          <section className="h-[106px] rounded-md border border-[#e4e6eb] bg-gradient-to-r from-[#d8e5ff] to-[#ece7ff] p-3">
            <p className="text-[24px] font-semibold leading-none text-[#5f69d9]">沸点周刊</p>
          </section>
          <section className="h-[106px] rounded-md border border-[#e4e6eb] bg-gradient-to-r from-[#ffe7b9] to-[#fff5d9] p-3">
            <p className="text-sm font-semibold text-zinc-700">你是第一次被问住吗</p>
          </section>
        </aside>
      </div>
      <div className="fixed bottom-6 left-6 z-20 hidden h-8 w-8 items-center justify-center rounded-full bg-[#1f2937] text-xs text-white lg:flex">
        N
      </div>
      <div className="fixed bottom-8 right-5 z-20 space-y-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:shadow"
        >
          <ActionIcon kind="chat" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:shadow"
        >
          <ActionIcon kind="help" />
        </button>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:shadow"
        >
          <ActionIcon kind="more" />
        </button>
      </div>
    </main>
  );
}
