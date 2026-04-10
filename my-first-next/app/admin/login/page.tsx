import { Suspense } from "react";

import { LoginForm } from "@/components/admin/auth/LoginForm";

export const dynamic = "force-dynamic";

function LoginFormFallback() {
  return (
    <div className="mx-auto max-w-sm py-8 text-center text-sm text-zinc-500">
      加载表单…
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-semibold">管理员登录</h1>
      <p className="mb-8 text-center text-sm text-zinc-500">
        登录后可管理文章、删除评论与发布内容
      </p>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
