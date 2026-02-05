---
title: 解决困扰我多时的JS重复请求问题
published: 2025-11-18T08:46:02
description: 如果你在我的博客初创就关注了，且具有一定的技术能力，你会发现我的博客曾经有一段时间在疯狂魔改，这可能会导致一些问题，并影响至今
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/swup-js.png
tags:
  - Swup
  - JS
draft: false
lang: ""
---
# 正式开始
就如封面所说，我的博客是 **魔改** 而来的，而母版为 [saicaca/fuwari: ✨A static blog template built with Astro.](https://github.com/saicaca/fuwari) 

就如Fuwari原版所称，该项目是一个 **静态博客** ，也就是写文章和部署网站是分离的，而文章是一个个MarkDown文件，构建后输出为HTML

因为原项目一开始就根本没有考虑 **动态功能** 如目前我博客使用的 **访问量显示** ，所以在加入动态功能后可能会有一些问题

这个访问量显示的思路曾在 [该文章](/posts/static-view/) 曾讲述过。我假设你已经看完了，那么该思路的步骤有两个：1. 首先拿到全局分享Token 2. 拿该Token拿到实际的访问量

当时出现一个奇怪的问题，在步骤一中出现了多次的重复请求。自己分析后发现，我在博客中的三个地方都使用了同一套逻辑，且互相独立。白话来说，就是你打开博客，首先，它会获取全站访问量，同时，由于第一屏已经有一些文章，所以也会同时获取这些文章的访问量

但是这个全局分享Token在极长一段时间内根本不变，也就是会有特别多的冗余请求，于是当时我写了个中间件，将这个Token请求一次后就存到用户的浏览器，接下来需要用到的时候直接用，无需再次从网络请求中获取

但是在今天，有一位粉丝发现某些页面仍然会多次请求 Umami ，如图
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/swup-js-1.png)

于是，它开了一个 issue  [Bug: 站内转跳时由于swup处理不当导致的多umami实例 · Issue #79 · afoim/fuwari](https://github.com/afoim/fuwari/issues/79) ，告知我是Swup的问题，让Swup不管理这类JS即可，设置后的确可用

最终，使用该issue的方法后，我们随便打开一个页面，尝试分析，看看是否有问题
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/swup-js-2.png)
我们只看Umami请求：
- https://cloud.umami.is/script.js ：Umami官方的全局JS，注入在所有页面中，用于后续将访客行为告知给Umami
- http://localhost:4321/js/umami-share.js ：之前写的中间件，用于避免多次请求Umami拿全局Token
- https://umami.2x.nz/analytics/us/api/websites/5d710dbd-3a2e-43e3-a553-97b415090c63/stats?startAt=0&endAt=1763429011353&unit=hour&timezone=Asia%2FShanghai&compare=false ：获取全站统计信息。为什么在文章页也会获取全站统计？因为全站统计被安放在用户配置块，而用户配置块全局可见
- https://umami.2x.nz/analytics/us/api/websites/5d710dbd-3a2e-43e3-a553-97b415090c63/stats?startAt=0&endAt=1763429243350&unit=hour&timezone=Asia%2FShanghai&path=eq.%2Fposts%2Fswup-js%2F&compare=false ：获取本页统计信息
- 两个预检：由于CORS，请求源和被请求源不一致，这是浏览器自带的安全策略，实际顺序为 先预检（我不属于你？我能不能访问你？） - 再fetch（我允许你，访问吧） 。题外话：为什么需要预检？因为浏览器要确保该请求是对方明确允许的，而不是恶意网站强行访问的，否则会触发 **CSRF** 攻击，也就是对端源安全策略过于宽松，导致谁都能拿到信息，这些信息可能是敏感的（如登录Token，用户名与密码等）
- https://api-gateway.umami.dev/api/send ：Umami的官方JS，用于将本次访问的行为汇报给Umami

问题已被完美解决！无冗余请求，干净利落