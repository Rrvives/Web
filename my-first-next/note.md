# 项目修改总结

本文档汇总本仓库（`my-first-next`）的主要改动与使用说明，便于后续维护与部署。

---

## 环境与依赖

- **Node.js**：建议 **≥ 20.19**（`package.json` 中 `engines.node`）。Prisma 7 CLI 在 Node 18 下会报错，开发时请用 `nvm use 22` 等切换到 Node 20+。
- **包管理**：以 **pnpm** 为主；已删除与 pnpm 混用的 `package-lock.json`，避免 `node_modules` 与锁文件不一致。
- **Tailwind 原生绑定**：`.npmrc` 中为 `@tailwindcss` 指定官方 registry；`devDependencies` 中保留 `@tailwindcss/oxide-darwin-arm64`（Apple Silicon），其它平台需对应可选包或重装依赖。
- **postinstall**：Node ≥ 20 时自动执行 `prisma generate`；Node 18 会跳过并打印提示，需手动在 Node 20+ 下执行 `pnpm exec prisma generate`。

---

## Prisma 7 与数据库

- **连接配置**：`datasource` 的 URL 写在 **`prisma.config.ts`** 的 `datasource.url`（`env("DATABASE_URL")`），**不要**在 `schema.prisma` 里写 `url`。
- **客户端**：使用 **`@prisma/adapter-mariadb` + `mariadb`**，在 **`lib/db.ts`** 中：

  ```ts
  new PrismaClient({ adapter: new PrismaMariaDb(databaseUrl) })
  ```

  传入的是**适配器工厂**（`PrismaMariaDb`），不要传入 `await factory.connect()` 的结果。

- **`next.config.ts`**：`serverExternalPackages` 包含 `@prisma/client`、`@prisma/adapter-mariadb`、`mariadb`，避免打包问题。

- **数据模型**：
  - `Post`：文章。
  - `Comment`：评论（`postId` 外键、`author` 默认「匿名」、`content` 为 `Text`）；迁移目录见 `prisma/migrations/20260410160000_add_comments`。

执行迁移与生成（需 Node 20+）：

```bash
pnpm exec prisma migrate deploy   # 或开发用 migrate dev
pnpm exec prisma generate
```

---

## 博客前台

- **`/posts`**：文章列表，SSR（`dynamic = 'force-dynamic'`）。
- **`/posts/[id]`**：文章详情；**评论区**（列表 + 发表表单）；管理员可见「编辑 / 删除」与单条评论删除。
- **`/posts/new`**、**`/posts/[id]/edit`**：新建 / 编辑（**需登录**，由 middleware 拦截）。
- **API**：
  - `GET/POST /api/posts`（POST 需管理员）
  - `GET/PATCH/DELETE /api/posts/[id]`（PATCH/DELETE 需管理员）
  - `GET/POST /api/posts/[id]/comments`（公开读、写评论）
  - `DELETE /api/comments/[id]`（仅管理员）

---

## 管理员认证（密码 + JWT）

- **登录**：`POST /api/auth/login`，校验 **`ADMIN_PASSWORD_HASH`**（bcrypt），签发 JWT，写入 HttpOnly Cookie **`admin_session`**（约 8 小时）。
- **退出**：`POST /api/auth/logout`，清除 Cookie。
- **实现文件**：`lib/auth-tokens.ts`（JWT，可供 Edge middleware 使用）、`lib/auth.ts`（Cookie、`unauthorizedIfNotAdmin`）。
- **中间件** `middleware.ts`：未登录访问 `/admin/*`（除 `/admin/login`）、`/posts/new`、`/posts/:id/edit` 会重定向到 `/admin/login?from=...`。

### `.env` 建议配置

```env
DATABASE_URL=mysql://...
ADMIN_JWT_SECRET=至少16位随机字符串
# 方式 A：单引号包裹（ASCII 直引号 '，不要用弯引号）
ADMIN_PASSWORD_HASH='$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
# 方式 B（推荐，无 $ 解析问题）：把 60 字符哈希做 Base64 后写入（与 ADMIN_PASSWORD_HASH 二选一）
# printf '%s' '$2b$10$你的完整60字符' | base64
ADMIN_PASSWORD_HASH_B64=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

当前仓库示例 `.env` 中默认对应管理员密码为 **123456**。生产环境请务必改为强密码并更新 `ADMIN_PASSWORD_HASH_B64`。开发环境下若未配置 `ADMIN_PASSWORD_*`，登录路由会使用代码内嵌的同一默认哈希（仍为 123456），**切勿依赖此行为上线**。
```

生成密码哈希：

```bash
pnpm run hash-admin-password -- <你的管理员密码>
```

将脚本**打印出的那一整行**（以 `$2b$` 开头）用**英文单引号**包住后赋给 `ADMIN_PASSWORD_HASH`，保存后**重启** `npm run dev` / `pnpm dev`。

---

## 后台管理

- **`/admin/login`**：管理员登录页。
- **`/admin`**：概览（文章数、评论数）。
- **`/admin/posts`**：文章管理列表（编辑、删除；删除后留在后台列表）。
- **`AdminShell`**：后台顶栏与导航；登录页不显示该壳层。
- **站点导航** `components/SiteHeader.tsx`：已登录显示「写文章」「后台」；未登录显示「管理登录」。

---

## 前端交互说明

- 需带登录态的请求（改文章、删文章、登录等）在 `fetch` 中使用 **`credentials: 'include'`**，以便携带 Cookie。

---

## 常见问题

| 现象 | 处理 |
|------|------|
| `Cannot find module '.prisma/client/default'` | 在 Node 20+ 下执行 `pnpm exec prisma generate` 或重新 `pnpm install`（触发 postinstall）。 |
| `driverAdapterFactory.connect is not a function` | 确认 `lib/db.ts` 传入 `new PrismaMariaDb(url)`，不要传入 `connect()` 的结果。 |
| `@tailwindcss/oxide` 找不到原生绑定 | 使用 pnpm 重装；必要时为当前平台增加对应的 `@tailwindcss/oxide-*` 包或检查 `.npmrc` 镜像。 |

---

*文档由开发过程中的实现整理而成，若与代码不一致，以仓库内源码为准。*
