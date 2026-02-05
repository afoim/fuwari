---
title: 本站遭受了建站以来规模最大的一次DDoS攻击，总流量6.65TB，峰值瞬发1.95GB/s
published: 2025-12-16T08:28:59
description: 不是哥们，静态也打？
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ddos-6t.png
draft: false
lang: ""
---
# 引言
本站建站初使用 **静态** 架构就是防止别有用心之人进行DDoS

你想啊，一个静态网站，所有攻击流量都是打在 **CDN的边缘节点** 上，也就是等于攻打 **整个CDN厂商** 

一是很难打死，二是没必要，毕竟静态网站的背后没有源站，也不涉及利益，纯粹是白打

但在昨天，就有位神人试图攻打 **EdgeOne/ESA** 并且还真给他打死了，待我娓娓道来

*如果你就是那位神人，请联系我，我给您颁个奖*

# 初见端倪
于 **2025年12月16号 11:13**，我在和我的朋友测试项目的时候，有一个知识点他忘记了，我提议他前往我的博客查看，却被告知博客访问报 **570** 状态码

我立即使用 https://itdog.cn 测试了我的博客网站 https://acofork.com 发现大部分节点都为 **570** 状态码
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/4f3b8517527460574d03479cc64655be.png)
因为当时我的网站部署在 **EdgeOne** 

随后，我向腾讯客服求证，了解到该状态码是一个 **单节点限频访问** 的状态码
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/5082a73ffa31ee435c9c7894263ae4cd.png)

我的朋友甚至还在调侃说： **你网站🔥了** 
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ddos-6t-1.png)

但是事情貌似还有一些诡异，为什么海外都是 **200 OK** ？

我开始怀疑被打了
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ddos-6t-2.png)

可能玩静态久了，没有第一时间上到 **EdgeOne** 查看请求数和流量，想着都是静态，谁没事打呢

然后我就回家，暂时切了一下逻辑

- 之前： **EdgeOne Pages** 直接提供服务，但是570
- 现在： **EdgeOne CDN** 回源 **Cloudflare Pages** 

切完后逐步好转，虽然速度有些慢，然后我就睡觉了

# 茅塞顿开
睡醒后我越想越奇怪，于是就登上了 **EdgeOne Pages** 控制台，然后一看，我嘞个大雷
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2f4df8e383a1b41625ad02eb70375465.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/50480865cd7f11d7cc4b495bcbc48038.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/30bb8ddb905b6de8181d60ddf1b69dbe.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/01f15a24f395a3731010c8046cb2008c.png)

随后我抱着好奇的心态想看看ESA防御咋样，没想到刚切过去阿里云就给我发消息了
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/9318872dc53b38334312619b2373c81e.jpg)

于是...
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/5b3bcf42d0e4f73fbe031699a291a5c2.png)![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/c4b6bdd2c39ae7585b9d3ecc5dbe9c6d.png)

依旧是熟悉的印度尼西亚
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/5a86eb051d48615259e8dcecb0fe8185.png)

那没招了，随后我于10分钟内极速 **完全切到Cloudflare Pages** 
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ddos-6t-3.png)

目前来看 **Cloudflare Pages** 也挺绿的
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/image_2025-12-16_08-24-54.png)

最后发了一个被打的B站视频，然后得知

**我去！大手子来了！** 
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/Screenshot_2025-12-16-08-08-33-65_149003a2d400f6a.jpg)

# 赛后总结
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/d16b7b134dec1224dcfc16e59a21942f.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/3c33b054a3180932ae87bea8bd06c3ed.png)

**本站遭受了建站以来规模最大的一次DDoS攻击，总流量6.65TB，峰值瞬发1.95GB/s**

目前 **acofork.com** 域名所有主要业务重定向为 **2x.nz** ，所有业务采用 **Cloudflare CDN** 

如果各位大牛有防御方案/缓解措施，欢迎留言！