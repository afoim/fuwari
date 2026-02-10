# Fuwari For XueGao

> [!CAUTION]
> 该仓库由 XueGao 深度定制，并包含了最新的文章，如果你想以此为模板进行二改，需要一定的动手能力。

<img width="1858" height="948" alt="image" src="https://github.com/user-attachments/assets/55c2c63b-0dac-436e-aaa0-451ad2dfb65a" />


一个基于 Astro 构建的现代化个人博客主题，专注于技术分享与实践。

## ✨ 特性

- 🚀 基于 Astro 4.0+ 构建，性能卓越
- 📱 完全响应式设计，支持移动端
- 🌙 支持深色/浅色主题切换
- 📝 支持 Markdown 和 MDX 格式
- 🔍 内置搜索功能
- 📊 文章阅读时间统计
- 🏷️ 标签和分类系统
- 📈 SEO 优化
- 🎨 可自定义配置
- 💬 评论系统支持
- 📡 RSS 订阅支持

## 🛠️ 技术栈

- **框架**: Astro
- **样式**: Tailwind CSS + Stylus
- **交互**: Svelte
- **构建工具**: Vite
- **包管理**: pnpm
- **代码规范**: Biome

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览构建结果

```bash
pnpm preview
```

## 📝 使用指南

### 创建新文章

使用内置脚本快速创建新文章：

```bash
pnpm new-post helloword
```

### 清理未使用的图片

清理 `src/content/assets` 目录下未被引用的图片文件：

```bash
pnpm clean
```

### 规范化图片文件名

扫描 Markdown 文件中的图片引用，将文件名中的空格、逗号、多余的点等特殊字符移除，并同步更新文件引用。这有助于提高多构建平台的兼容性（某些平台不支持特殊字符文件名）。

```bash
pnpm del-space
```

### 配置博客

编辑 `src/config.ts` 文件来自定义博客配置：

```typescript
export const siteConfig: SiteConfig = {
  title: "Fuwari",
  subtitle: "技术分享与实践",
  lang: "zh_CN",
  themeColor: {
    hue: 250,
    fixed: false,
  },
  banner: {
    enable: false,
    src: "assets/images/demo-banner.png",
    position: "center",
  },
  favicon: [
    {
      src: "/favicon/icon.png",
    }
  ]
}
```

### 文章格式

文章使用 Markdown 格式，支持 frontmatter：

```markdown
---
title: 文章标题
published: 2024-01-01
description: 文章描述
image: ./cover.jpg
tags: [标签1, 标签2]
category: 分类
draft: false
---

# 文章内容

这里是文章正文...
```

## 📁 项目结构

```
├── public/                 # 静态资源
├── src/
│   ├── components/         # 组件
│   ├── content/           # 内容
│   │   ├── posts/         # 博客文章
│   │   └── assets/        # 资源文件
│   ├── layouts/           # 布局
│   ├── pages/             # 页面
│   ├── styles/            # 样式
│   └── config.ts          # 配置文件
├── scripts/               # 脚本工具
└── package.json
```

## 🎨 自定义

### 主题颜色

在 `src/config.ts` 中修改 `themeColor` 配置：

```typescript
themeColor: {
  hue: 250,        // 主色调 (0-360)
  fixed: false,    // 是否固定颜色
}
```

### 样式定制

- 全局样式：`src/styles/main.css`
- Markdown 样式：`src/styles/markdown.css`
- 变量定义：`src/styles/variables.styl`

## 📦 部署

构建后的静态文件位于 `dist/` 目录，可部署到任何静态托管平台。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！尤其感谢[上游仓库](https://github.com/saicaca/fuwari)
