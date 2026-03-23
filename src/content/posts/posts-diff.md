---
title: 如何给你的文章上修订记录？就像维基百科那样！
published: 2026-02-11T10:51:13
description: 虽然我们已经做了基于客户端的文章更新提醒，但如果读者还没来得及查看上一次改动，文章又发生了新的变化呢？这时候，就需要一套覆盖完整生命周期的文章 diff 展示方案。
image: ../assets/images/posts-diff.png
draft: false
lang: ""
ai_level: 2
---

# 正式开始

此前，我们给博客加过一个文章更新提醒功能，也就是右下角的小铃铛图标。它可以通过比较你上次访问和这次访问之间的差异，给出醒目的提示，并告诉你哪些文章发生了更新、更新了什么内容。

![](../assets/images/posts-diff-1.png)

但我们还想再进一步：能不能让读者直接看到每次文章更新的具体明细呢？

当然可以。由于我们使用 Git 做版本控制，因此天然就能读取每一篇文章的修订历史。

```sql
(TraeAI-5) C:\Users\af\Documents\GitHub\fuwari [1:128] $ git log src/content/posts/pin.md
commit f6e3e174da195c05ef0feecca16cf79496e3374b
Author: 二叉树树 <acofork@qq.com>
Date:   Mon Feb 9 07:50:52 2026 +0800

    压缩图片

commit 7deafa112126f32e71159d824b334ec63b93fa59
Author: 二叉树树 <acofork@qq.com>
Date:   Sun Jan 25 21:43:53 2026 +0800

    fix(NewPostNotification): 修复更新检测逻辑以包含标题和描述变更

    之前仅检测内容变更和发布日期更新，现在扩展检测逻辑以包含标题、描述等元数据的变更，确保任何修改都能正确触发更新通知。

commit 75be2cc6528b9e78e1c99dce8e54696a22c6146b
Author: 二叉树树 <acofork@qq.com>
Date:   Sun Jan 25 21:37:05 2026 +0800

    fix: 为RSS请求添加缓存禁用选项以获取最新内容

    在fetch请求中设置cache: 'no-store'，防止浏览器缓存导致无法及时获取最新的RSS内容，确保新文章通知能正确显示。

commit 702c1ca11398a44c839d8526f84e62cae4f8ee07
Author: 二叉树树 <acofork@qq.com>
Date:   Sun Jan 25 21:25:57 2026 +0800

    feat(widget): 增强新文章通知组件的交互和视觉效果

    - 为通知铃铛添加入场动画和退出逻辑，提升用户体验
    - 新增“清空通知”按钮，允许用户重置通知基准时间
    - 优化无更新和有时更新的状态显示，合并时间信息
    - 为通知点添加脉冲动画以增强视觉提示
    - 调整面板响应式布局，在小屏幕上优化底部间距

commit ddd201a7f44003c305a045b73f944ad281606dbf
Author: 二叉树树 <acofork@qq.com>
Date:   Sun Jan 25 21:02:10 2026 +0800

    style(Markdown): 为 Markdown 组件添加断词样式

    在 Markdown 容器 div 的类名中添加 `break-words` 实用类，确保长单词或 URL 在超出容器宽度时自动换行，避免破坏页面布局。

commit c507a478cd602102821915caeb5e7b81165383a2
Author: 二叉树树 <acofork@qq.com>
Date:   Sun Jan 25 20:28:34 2026 +0800

    fix(通知组件): 修复查看更新按钮点击失效问题并优化滚动条样式

    - 将 data-diff-toggle 事件委托改为直接 onclick 绑定，解决 Astro 组件重渲染时事件监听失效问题
    - 为更新列表添加 overflow-x: hidden 防止水平滚动
    - 在组件内定义自定义滚动条样式，统一各浏览器显示效果
    - 调整通知级别从 warning 改为 info 以匹配实际使用场景

commit d77c485f00c192de3bfd9f40ed75afe313d0cc1b
Author: 二叉树树 <acofork@qq.com>
Date:   Sat Jan 24 16:19:25 2026 +0800

    fix: 更新默认图片链接为本地路径

    将外部图片链接 https://t.alcy.cc/ycy 统一替换为随机图地址 https://c-p.2x.nz/h，
    包括置顶文章、记录文章和站点背景配置，确保图片资源的稳定性和一致性。

commit 29afb7adb5c91dfb0904cdccbc08b48ce73e7245
Author: 二叉树树 <acofork@qq.com>
Date:   Thu Jan 15 16:04:10 2026 +0800

    fix: 更新图片链接并移除无用脚本

    将多个页面的图片链接统一更新为新的CDN地址
    移除布局文件中不再需要的外部脚本
    更新背景图片配置为新的CDN地址
:
```

因此，我们完全可以在网站构建阶段增加一道处理流程：读取 Git 提交历史，生成文章更改索引文件，再把它放进最终产物中。

思路成立之后，就可以开始动手实践了。

```sql
(TraeAI-5) C:\Users\af\Documents\GitHub\fuwari [0:141] $ pnpm update-diff

> fuwari@0.0.1 update-diff C:\Users\af\Documents\GitHub\fuwari
> node scripts/update-diff.js

Generating git history...
Using concurrency: 19
Processed 154/154 files...
Git history generated for 154 files.
Output saved to src/json/git-history.json
```

很好，索引已经成功生成。接下来看看实际效果。

![](../assets/images/posts-diff-2.png)

接下来，再在开发环境里验证一下。

![](../assets/images/posts-diff-3.png)

结果也没有问题，接下来就可以开始做自动化了。

由于我使用 Cloudflare Worker 连接 GitHub 仓库进行 CI，因此需要把生成文章 diff 的逻辑注入到构建流程中。

一开始，我的想法很直接：把构建命令从 `pnpm build` 改成 `pnpm update-diff && pnpm build`。

但转念一想，Cloudflare Worker 在克隆仓库时默认并不带完整历史，因此自然也拿不到完整的文章 diff。

那有没有“曲线救国”的办法呢？答案是有的。于是我让 ChatGPT 帮我草拟了一条稍显冗长、但确实可用的构建命令。

```sql
git clone https://github.com/afoim/fuwari temp \
&& cd temp \
&& corepack enable \
&& pnpm update-diff \
&& cd .. \
&& mkdir -p src/json \
&& mv -f temp/src/json/git-history.json src/json/git-history.json \
&& rm -rf temp \
&& pnpm build

```

仔细分析一下，这段命令的逻辑其实并不复杂。

由于 Cloudflare Worker 默认克隆到的仓库没有提交历史，所以我们就额外再克隆一个带完整历史的仓库，在里面生成文章 diff 索引；随后把这个索引文件复制回 Cloudflare 自动克隆的仓库，再清理掉临时仓库，最后执行原本的构建命令。

虽然看起来有点“堆命令”，网页控制台里也会出现一大段神秘脚本：

![](../assets/images/posts-diff-4.png)

但它确实能稳定工作，这就已经足够了。

![](../assets/images/posts-diff-5.png)

最终，我们只需要专注于写文章并推送到 GitHub，Cloudflare 就会自动生成最新的文章 diff，并把它展示在生产环境中。

![](../assets/images/posts-diff-6.png)
