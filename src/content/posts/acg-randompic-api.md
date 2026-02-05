---
title: 公开架构，我的二次元随机图API是怎么做的
published: 2025-09-06T02:22:00
description: '发现很多小伙伴也想搭建一个自己的随机图API，这里我就公开一下我的架构，打磨2年了，供大家参考~'
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-31-04-09-37-image.png'
tags: [随机图API]

draft: false 
lang: ''
---

# API端点

~~门户： https://pic.072103.xyz~~

~~门户里面的API端点： https://hpic.072103.xyz https://vpic.072103.xyz （CF Worker）~~

博客用的API端点： https://eopfapi.acofork.com/pic?img=ua （EdgeOne Pages Functions）

# 新版实现

图源存放EdgeOne Page，EdgeOne Pages Functions作为入口，当收到请求后首先区分 横屏、竖屏、自适应，即 `?img=h` `?img=v` `?img=ua` ，随后返回其内部存储的相应图片，关于更多详情，请参考源码： [EdgeOne_Function_PicAPI/functions/pic.js at main · afoim/EdgeOne_Function_PicAPI](https://github.com/afoim/EdgeOne_Function_PicAPI/blob/main/functions/pic.js)
# 旧版实现

利用 cnb.cool 存储图片eopf做中间代理
# 旧旧版实现

> 在Cloudflare R2被刷了 **7千万次（GET）请求** 并且扣款 **28.08 USD（折合人民币 207.93 CNY）** 后废弃 

图源全部存在 **Cloudflare R2**，全部采用 **Webp** 格式，仅分类为 **横屏、竖屏** ，如图

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-31-04-13-08-image.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-31-04-13-17-image.png)

API就拿我正投入使用的 https://eopfapi.acofork.com/pic?img=ua 来说

看域名也可以看出来，这是一个 **EdgeOne Pages Functions** 服务（下文简称 **eopf** ），什么？你问为什么用这个？那当然是因为！ **目前所有功能完全免费！**

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-31-04-18-45-image.png)

源码在 [afoim/EdgeOne_Function_PicAPI: 适用于EdgeOne边缘函数的随机图API](https://github.com/afoim/EdgeOne_Function_PicAPI)

原理为让 **eopf** 连接上 **Cloudflare R2** 然后随机拿一张图出来。没错！就这么简单！

*上文提到的另一个CF Worker端点原理也一样，只不过CF内部连接R2就不用手搓S3鉴权了*
