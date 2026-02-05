---
title: 你有一个全球网站？如何做好监控？
published: 2026-01-09T11:26:02
description: 如果你正好在运营一个全球性的网站，它可能在不同地区有不同节点，我们要如何做好宕机提醒？
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/double-monitior.png
draft: false
lang: ""
---
# 正式开始
> 视频： https://www.bilibili.com/video/BV14dqwBVEa5/

比如说我的博客
::url{href=https://blog.acofork.com}

它在国内的节点是 **阿里云 ESA Pages/EdgeOne Pages** ，而在国外的节点是 **Cloudflare Page**

我使用的方案是在国内自托管一个 **Uptime Kuma** 服务，而在海外使用一些大厂的云监控，如 **BetterStack** **UptimeRobot** 等等，并且让他们互相监控

对于大厂的监控，我们不必做防护，但对于你自托管的监控，推荐套 **Cloudflare Tunnel** ，防止被DDoS

国内监控：
::url{href=https://kuma.2x.nz}

海外监控：
::url{href=https://vps.2x.nz}

