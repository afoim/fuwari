---
title: 配置 Vercel.json 以支持服务器级别的重定向
published: 2025-09-02T06:33:27
description: '如果你的站点（无论静态/动态）正在使用Vercel，则配置重定向是一件非常轻松的事情'
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-09-02-06-34-54-image.png'
tags: [Vercel, 重定向]

draft: false 
lang: ''
---

# 正式开始

> 官方文档： [Redirects](https://vercel.com/docs/redirects)

在你的仓库根目录创建 `vercel.json` 写入重定向规则

`source` 为要重定向的路径，`destination` 为重定向到的路径/URL，`permanent` 为一个可选的布尔值，用于在永久重定向和临时重定向之间切换（默认为 `true`）。当 `true` 时，状态代码为 [308](https://developer.mozilla.org/docs/Web/HTTP/Status/308)。当 `false` 时，状态代码为 [307](https://developer.mozilla.org/docs/Web/HTTP/Status/307)。

```json
{
  "redirects": [
    {
      "source": "/ak",
      "destination": "https://akile.io/register?aff_code=503fe5ea-e7c5-4d68-ae05-6de99513680e",
      "permanent": false
    },
    {
      "source": "/kook",
      "destination": "https://kook.vip/K29zpT",
      "permanent": false
    },
    {
      "source": "/long",
      "destination": "https://iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.in/",
      "permanent": false
    },
    {
      "source": "/mly",
      "destination": "https://muleyun.com/aff/GOTRJLPN",
      "permanent": false
    },
    {
      "source": "/tg",
      "destination": "https://t.me/+_07DERp7k1ljYTc1",
      "permanent": false
    },
    {
      "source": "/tit",
      "destination": "/posts/pin/",
      "permanent": false
    },
    {
      "source": "/tly",
      "destination": "https://tianlicloud.cn/aff/HNNCFKGP",
      "permanent": false
    },
    {
      "source": "/wly",
      "destination": "https://wl.awcmam.com/#/register?code=FNQwOQBM",
      "permanent": false
    },
    {
      "source": "/yyb",
      "destination": "https://www.rainyun.com/acofork_?s=bilibili",
      "permanent": false
    }
  ]
}
```
