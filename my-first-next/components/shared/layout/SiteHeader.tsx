import Link from "next/link";

import { isAdminFromCookies } from "@/lib/auth";

const navLinkClass = "text-[14px] text-zinc-600 transition hover:text-zinc-900";

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-zinc-400">
      <path
        fill="currentColor"
        d="M12 3a5 5 0 0 0-5 5v2.3c0 .8-.3 1.6-.8 2.2L4.7 14a1 1 0 0 0 .8 1.7h13a1 1 0 0 0 .8-1.7l-1.5-1.5a3.3 3.3 0 0 1-.8-2.2V8a5 5 0 0 0-5-5m0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21"
      />
    </svg>
  );
}

export default async function SiteHeader() {
  const isAdmin = await isAdminFromCookies();

  return (
    <header
      data-site-header="true"
      className="sticky top-0 z-30 border-b border-[#e5e6eb] bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex h-[60px] w-full max-w-[1200px] items-center gap-3.5 px-4">
        <Link href="/" className="flex items-center gap-2 text-[18px] font-semibold tracking-tight text-zinc-900">
          <span className="inline-block h-5 w-5 rounded-sm bg-[#1e80ff]" />
          稀土掘金
        </Link>
        <nav className="hidden items-center gap-[18px] md:flex">
          <Link href="/" className="text-[15px] font-medium text-sky-600">
            首页
          </Link>
          <Link href="/posts" className={navLinkClass}>
            沸点
          </Link>
          <Link href="/posts" className={navLinkClass}>
            课程
          </Link>
          <span className="-ml-3 -mt-3 rounded bg-[#ff4d4f] px-1 py-0.5 text-[9px] leading-none text-white">
            HOT
          </span>
          <Link href="/posts" className={navLinkClass}>
            直播
          </Link>
          <Link href="/posts" className={navLinkClass}>
            活动
          </Link>
          <Link href="/posts" className={navLinkClass}>
            AI Coding
          </Link>
          <Link href="/posts" className={navLinkClass}>
            更多
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden h-9 w-[238px] items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-400 md:flex">
            <span>探索稀土掘金</span>
            <span className="text-zinc-500">⌕</span>
          </div>
          <Link
            href="/creator"
            className="rounded-md bg-[#1e80ff] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#1171ee]"
          >
            创作中心
          </Link>
          <span className="hidden md:inline-flex">
            <BellIcon />
          </span>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#ff9f6c] to-[#9d4dff]" />
          {isAdmin ? (
            <Link href="/admin" className="text-xs text-zinc-500 hover:text-zinc-900">
              后台
            </Link>
          ) : (
            <Link href="/admin/login" className="text-xs text-zinc-500 hover:text-zinc-900">
              登录
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
