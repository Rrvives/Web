import { CommentForm } from "@/components/post/comments/CommentForm";
import { DeleteCommentButton } from "@/components/post/comments/DeleteCommentButton";
import { getPrisma } from "@/lib/db";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function relativeFrom(date: Date) {
  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  return `${Math.floor(diff / day)}天前`;
}

export async function CommentSection({
  postId,
  isAdmin,
}: {
  postId: number;
  isAdmin: boolean;
}) {
  const prisma = getPrisma();
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mt-10 border-t border-zinc-200 pt-8">
      <h2 className="text-[32px] font-semibold tracking-tight text-zinc-900">
        评论 {comments.length}
      </h2>

      <div className="mt-4">
        <CommentForm postId={postId} />
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <button type="button" className="font-medium text-[#1e80ff]">
          最热
        </button>
        <button type="button" className="text-zinc-500">
          最新
        </button>
      </div>

      <div className="mt-3">
        {comments.length === 0 ? (
          <p className="rounded-md border border-dashed border-zinc-200 px-4 py-6 text-sm text-zinc-500">
            暂无评论，来抢沙发吧。
          </p>
        ) : (
          <ul className="space-y-0">
            {comments.map((c: (typeof comments)[number], index: number) => (
              <li key={c.id} className="border-b border-zinc-100 py-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-[#78b4ff] to-[#4c7cff]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[13px]">
                      <span className="font-medium text-zinc-800">{c.author}</span>
                      <span className="rounded bg-[#eaf2ff] px-1 py-0.5 text-[10px] leading-none text-[#1e80ff]">
                        作者
                      </span>
                      <time
                        className="text-xs text-zinc-400"
                        dateTime={c.createdAt.toISOString()}
                      >
                        {formatDate(c.createdAt)}
                      </time>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-[14px] leading-7 text-zinc-700">
                      {c.content}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-zinc-400">
                      <span>{relativeFrom(c.createdAt)}</span>
                      <button type="button" className="hover:text-zinc-600">
                        ♡ 点赞
                      </button>
                      <button type="button" className="hover:text-zinc-600">
                        ↩ 回复
                      </button>
                      <button type="button" className="hover:text-zinc-600">
                        ⋯
                      </button>
                      {isAdmin ? <DeleteCommentButton commentId={c.id} /> : null}
                    </div>
                    {index % 2 === 0 ? (
                      <div className="mt-3 rounded-md bg-[#f7f8fa] px-3 py-2">
                        <p className="text-xs text-zinc-500">
                          <span className="font-medium text-[#1e80ff]">作者</span>：感谢反馈，已补充说明。
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
