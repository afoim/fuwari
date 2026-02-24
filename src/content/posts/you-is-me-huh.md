---
title: 你是我吗？
published: 2025-08-12T15:43:18
description: '博客开源了就会有很多小笨蛋Fork完改也改不全，导致评论也评论到我这来了，浏览量统计也来我这来了😅'
image: '../assets/images/2025-08-12-15-44-06-image.webp'
tags: [CORS]
category: '记录'
draft: false 
lang: ''

---

# 前情提要

今天收到一封小邮件

![](../assets/images/2025-08-12-15-45-18-image.webp)

我一眼就看出来了

有人Fork完我的仓库但是Giscus评论区没改成自己的。

# Giscus仅允许自己

在启用了Giscus的仓库放一个文件

```json
<!-- giscus.json -->
{
  "origins": ["https://2x.nz"]
}
```

这样设置后，即使有人在它的网站上引入了**你的评论区**，也会被拒绝显示

![](../assets/images/2025-08-12-15-48-23-image.webp)

# Umami仅允许自己

我博客有一个浏览量统计，基于Umami，之前是没鉴权的，如果你啥也不改，访问你的网站也会记到我网站上😅

Umami并没有给配置来更改CORS（毕竟这个访问量统计是我逆向出来的）

但是我的Umami套了EO，我可以直接写一套CORS规则仅允许自己调用

![](../assets/images/2025-08-12-15-50-25-image.webp)

这样的话，即使你啥也不改，也不会把错误的统计信息发到我这，会报错CORS头不允许

![](../assets/images/2025-08-12-15-51-04-image.webp)

# 最后

开源是为了让大家更好的学习我的博客框架，不是让你照搬，请确认将所有内容、API端点、私有服务全部改为自己的后再上线！

你要是懒可以Fork[上游原仓库](https://github.com/saicaca/fuwari)从白纸开始[改](/posts/fuwari/)
