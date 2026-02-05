---
title: 利用Astrov3的原生重定向来实现各种各样的高级重定向！
published: 2025-09-02T05:56:19
description: '曾经，我使用Cloudflare Pages Redirects来实现我的个人短链重定向，而现在我发现我可以直接将它集成到我的Astro博客'
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-09-02-05-59-33-image.png'
tags: [重定向, Astro]

draft: false 
lang: ''
---

# 正式开始

> Astro v3 正式支持了原生的重定向 [路由 | 文档 - Astro 文档](https://docs.astro.js.cn/en/guides/routing/#configured-redirects)

仅需在 `astro.config.mjs` 中添加如下代码，示例代码将 `/tit` 的请求 302 重定向到 `/posts/pin` 。可以配置多行重定向规则

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  redirects: {
    "/tit": {
        destination: "/posts/pin/",
        status: 302,
    },
  }
});
```

有的小伙伴就会问了，如果我的Astro输出模式为SSG？那Astro的重定向是不是不支持 `location` 重定向？仅支持 `HTML` 重定向？

的确，在不对构建服务商进行额外配置的情况下，Astro会使用兼容模式，创建 `HTML` 重定向，你可以尝试安装适配器来支持重定向，但需要注意 **并不是所有适配器都会透传Astro中设置的重定向规则** ，始终建议使用您构建服务商提供的重定向服务，参见： [配置 Vercel.json 以支持服务器级别的重定向](/posts/vercel-redirects/)。如配置 `vercel.json` 。关于 Astro 适配器的更多信息，参见 [配置参考 | Docs](https://docs.astro.build/zh-cn/reference/configuration-reference/#adapter)
