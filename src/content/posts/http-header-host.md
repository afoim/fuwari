---
title: 利用自定义HTTP请求头Host字段实现单节点分流域名的监控
published: 2026-01-13T17:28:33
description: 如果说你有个分流域名，正常来说我们需要两个监测源模拟国内和海外用户访问，但真的需要这么麻烦吗...
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/http-header-host.png
draft: false
lang: ""
---
# 原理
CDN上托管了那么多的网站，那它是如何识别每个用户需要访问哪个网站的呢？

针对 HTTPS ，CDN 会检查SSL握手报文中的 `Server_Name` 字段。而针对 HTTP ，CDN 会检查请求头中的 `Host` 字段

也就是说，对于海外CDN是否存活，我们可以通过直接访问CDN节点，如： `http://blog.acofork.com.a1.initww.com` 并携带上 `Host` 头指定为 `blog.acofork.com` ，从而强制指定节点访问业务网站，不走分流

那么如果CDN开启了强制HTTPS呢？那就关掉

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/http-header-host-3.png)

# 常用CDN节点

- Cloudflare：你自己的优选域名，如 **http://cdn.2x.nz** 
- Github： **http://pages.github.com** 

# 正式开始
部署一个Uptime Kuma（或者其他服务，监测源必须在国内。因为EO，ESA我们要做拦截海外策略）

如图写监测项目，直接使用HTTP协议监测CDN节点，并且携带Host头，将重定向设为0，只要返回 200 就算存活（为了减轻站点压力，建议使用HEAD请求）

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/http-header-host-1.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/http-header-host-2.png)

# Demo
::url{href="https://status.acofork.com"}