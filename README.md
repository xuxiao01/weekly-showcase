<p align="center">
  <img src="https://typorabucket0308.oss-cn-beijing.aliyuncs.com/images/20260603103934962.jpg" alt="项目预览图" width="800" />
</p>

<h1 align="center">Weekly Showcase</h1>
<p align="center">
  个人周报展示单页：类 PPT 翻页浏览，支持 Markdown 粘贴导入与多周次管理。
</p>

## 项目简介

Weekly Showcase 是一个基于 Vue 3 的前端单页应用，用于把周报内容以演示文稿的方式展示出来。每一页对应一个业务模块（如「小程序开发」「游戏试玩平台开发」），通过右下角按钮切换，并带有简洁的 GSAP 翻页动效。

项目不依赖后端。周报数据可通过 Markdown 粘贴导入，解析后保存在浏览器 `localStorage`；开发环境下提交时还会同步写入 `src/data/weeklyReports.ts`，方便本地固化默认数据。适合个人周报归档、组内周会演示等场景。

## 功能特性

- 全屏单页展示，100vh 布局，类 PPT / Keynote 翻页体验
- GSAP 页面切换动效（淡出上移 / 淡入上移），支持 `prefers-reduced-motion`
- 多周次管理：顶部工具栏切换周次，桌面端弹出选择、移动端底部抽屉
- Markdown 粘贴导入：按 `# 一级标题` 自动分页，解析「本周完成」「未来展望」列表
- 支持标题写法 `第一部分｜小程序开发`，或仅写 `# 小程序开发`（自动补全部分序号）
- 列表项支持附加 Markdown 图片，点击可预览
- 提交时可配置年份、周数、日期范围
- 数据持久化：`localStorage` 保存多周周报；`sessionStorage` 保存粘贴草稿
- 开发模式：提交后通过 Vite 中间件回写 `weeklyReports.ts` 源码
- 响应式适配：窄屏下工具栏与弹层改为移动端交互

## 技术栈

- Vue 3（Composition API + `<script setup>`）
- TypeScript
- Vite 8
- GSAP 3
- 普通 CSS（无 UI 组件库）

## 目录结构

```text
weekly-showcase/
├── .github/workflows/     # CI 部署配置
├── public/                # 静态资源
├── src/
│   ├── components/        # 页面组件（内容区、导航、粘贴面板等）
│   ├── composables/       # GSAP 翻页逻辑
│   ├── data/              # 默认周报数据（weeklyReports.ts）
│   ├── utils/             # Markdown 解析与本地存储
│   ├── App.vue            # 应用入口与状态管理
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
└── vite.config.ts         # 含开发环境数据回写插件
```

## 本地运行

项目使用 **npm** 作为包管理器（存在 `package-lock.json`）。

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产包：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

开发服务默认地址见终端输出。生产构建 `base` 为 `/weekly/`，部署到子路径时需保持与 `vite.config.ts` 一致。

## Markdown 格式说明

每个 `# 一级标题` 对应展示页中的一页，常用结构如下：

```md
# 第一部分｜小程序开发

## 本周完成
- 优化了识字量小程序的主包大小
- 首页分享功能已上线

## 未来展望
- 给小程序做分包

# 游戏试玩平台开发

## 本周完成
- 条目一

## 未来展望
- 计划一
```

说明：

- `## 本周完成`、`## 未来展望`（兼容 `下周计划`）下的 `-`、`*` 或数字列表会被解析为条目
- 标题可写 `第一部分｜模块名`，也可只写模块名并由解析器自动补「第一部分」「第二部分」等
- 列表项后可直接跟 Markdown 图片：`![说明](图片地址)`
- 页面内可写日期行，如 `2026 年第 23 周 · 06.01 - 06.05`（可选）

在「粘贴 Markdown」弹层中填写年份、周数与日期后点击 **提交**，即可更新当前周次内容并回到展示页。

## 环境变量

当前项目**无** `.env` / `.env.example` 配置，前端运行不依赖环境变量。

## 部署说明

### 构建产物

```bash
npm run build
```

构建结果输出到 `dist/` 目录。

### GitHub Actions

仓库已配置 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)：推送到 `main` 分支后自动执行 `npm install`、`npm run build`，并通过 SCP 将 `dist/` 部署到服务器。

需在 GitHub Secrets 中配置：

| Secret | 说明 |
| --- | --- |
| `SERVER_HOST` | 服务器地址 |
| `SERVER_USER` | SSH 用户名 |
| `SERVER_SSH_KEY` | SSH 私钥 |
| `SERVER_PORT` | SSH 端口 |

具体部署路径与服务器环境以工作流文件为准。

### 静态资源托管

也可将 `dist/` 部署到任意静态服务器（Nginx、对象存储等）。注意 `vite.config.ts` 中 `base: '/weekly/'`，若部署在站点根路径需相应调整。

## 后续计划

- 支持 Markdown 文件上传（除粘贴外）
- 导出当前周次为 `.md` 文件
- 补充单元测试（解析器、存储逻辑）
- 完善部署与使用文档

## License

待补充
