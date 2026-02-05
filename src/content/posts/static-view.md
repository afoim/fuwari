---
title: 静态博客也想展示文章浏览量？当然可以！
published: 2025-06-18
description: '利用Umami等站点分析软件可以让管理员了解站点活跃度，但是如果我们想向用户展示一些数据呢？'
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/acacac41-e1e1-4a15-bdae-05683656916c.webp
tags: [Cloudflare, Umami]
category: '教程'
draft: false 
lang: ''
---

# 引言



如果你用过WordPress，Halo等动态博客框架，你大概会在用户视角访问博文的时候看到浏览量这个信息。

这个原理很简单，因为动态博客依赖于一个VPS，只需要让用户每次访问的时候给浏览量+1即可。

那么如果我们是静态博客呢？

我们可以依赖一些第三方服务，比如[Umami Cloud](https://umami.is)。在你的静态博客的head注入一个js，这样你就可以看到你的站点分析了，类似下图

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2c1e7d81-6f6d-4323-b0de-013b2d168be1.webp)

现在我们确实可以看到每个文章（即/posts/xxx）的访问量了，但是我们要如何展示给用户呢？

# 逆向Umami的只读页面！（新版v3）

> 感谢nightNya提供的方案，你是天才！

首先我们启用分享URL

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/023f687b-6e4a-46d8-b7f2-4778f20ebe99.webp)

注意这里的 `7PoDRgCzHFTs2vWB` ，每个站点都不一样

接着我们请求 `https://cloud.umami.is/analytics/us/api/share/7PoDRgCzHFTs2vWB`，得到
*注意，这里的 `us` 为你创建的账号区域，美国为us，欧盟为eu*

```json
{
  "websiteId": "a66a5fd4-98b0-4108-8606-cb7094f380ac",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJzaXRlSWQiOiJhNjZhNWZkNC05OGIwLTQxMDgtODYwNi1jYjcwOTRmMzgwYWMiLCJpYXQiOjE3NTA4MDIwMzB9.X5GQT5kslh6r25sFlap4Asz1NDA7mN3kcZW8wqbrnBc"
}
```

再接着我们请求，携带请求头 `x-umami-share-token` 值为上一步获得的Token

`https://cloud.umami.is/analytics/us/api/websites/a66a5fd4-98b0-4108-8606-cb7094f380ac/stats?startAt=0&endAt=1750805999999&unit=hour&timezone=Asia/Hong_Kong&path=eq./posts/cf-fastip/&compare=false`

这里解释几个关键Params，其他的照搬

- startAt：统计开始时间。Unix时间戳，我们填写为0让Umami从1970年开始统计

- endAt：统计结束时间。Unix时间戳，我们可以使用 `Date.now()` ，即当前时间，和startAt参数联动即可实现统计总浏览量

- path：要查询的路径，填写为你的文章页去除了Host的路径，如 `/posts/hello` 。注意！Umami会将 `/posts/hello` 和 `/posts/hello/` 视为两个不同的路径，请注意你的博客框架是否使用 `/`。在v3版本中，需要使用 `eq.` 前缀来进行精确匹配，例如 `path=eq./posts/hello/`

你会得到

```json
{
    "pageviews": 1655,
    "visitors": 343,
    "visits": 411,
    "bounces": 183,
    "totaltime": 30592,
    "comparison": {
        "pageviews": 0,
        "visitors": 0,
        "visits": 0,
        "bounces": 0,
        "totaltime": 0
    }
}
```

`pageviews` 即浏览量。 `visitors` 即访问人数。

> Tips：浏览量记录为任意用户只要访问了则计数一次。而访问数记录不会记录单IP多次重复访问和同一时间段的多次请求不同页面

Enjoy it！

最终效果：

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ce822960-f7ef-444e-84d1-fa0758e2b5e8.webp)
