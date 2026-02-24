---
title: 无需服务器！从零教你自建一个短链服务！
published: 2026-01-09T10:55:33
description: 你是否有一个短域名？没有也没关系，马上教你从域名开始搭建一个短链服务！
image: ../assets/images/shorter-url.webp
draft: false
lang: ""
---
# 视频
https://www.bilibili.com/video/BV1BCi1B7E1q/

# Demo
https://2x.nz/s

# 拿域名！
我们需要一个短域名，来作为我们的短链服务的入口

我们可以前往这些地方购买短域名，建议后缀 `.nz` `.mk` `.im` ，建议2-3位长度的域名
- [迈向未来 - Spaceship](https://www.spaceship.com/zh/)
- [porkbun.com | An oddly satisfying experience.](https://porkbun.com/)
- [【趣域网】域名注册网站哪个好_注册域名查询购买_whois信息查询_域名交易网_ - 趣域网](https://www.quyu.net/)

# 基础思路
Cloudflare Page/Worker的重定向文件提供了基于文件的重定向功能，参考 [这篇文章](/posts/cfpage-redirect/)

接下来我们再利用 Cloudflare Worker 连接Github帮我们去更新这个文件，顺便搓一个前端出来让用户能够生成短链即可

# 防护措施
> [!CAUTION]
> 必须在最终重定向时不直接重定向到业务域名，需要配置中间页，否则你的域名一定会在后期被举报为 **滥用/钓鱼/诈骗网站** 
- 重定向文件限制静态重定向 **2000** ，动态重定向 **100**
- 单行字符串不超过 **1024**

# 服务架构图

![](../assets/images/MermaidChart-Createcomplexvisualdiagramswithtext-2026-01-09-031619.webp)

