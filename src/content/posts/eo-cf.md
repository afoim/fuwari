---
title: EdgeOne + Cloudflare，我们天下无敌！
published: 2025-06-27
description: 'EdgeOne的低延迟+Cloudflare的强大业务！我都不敢想这有多爽！'
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/50839e45-bb5c-4fd5-8e88-3959295fb9bb.webp
tags: [EdgeOne, Cloudflare]
category: '记录'
draft: false 
lang: ''
---

# 引言

主播也是搞到了EdgeOne免费版激活码了，终于可以大展宏图了😋

# 我怎么换到EdgeOne免费版？

前往 [腾讯云EdgeOne免费计划兑换码 - 立即体验](https://edgeone.ai/zh/redemption)

推荐直接发推，按照要求发

发完后私信EO官方即可

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/9ccbf7c1-6006-45f6-a9f4-e1979df8b12b.webp)

# 默认EdgeOne给的Anycast CNAME过于垃圾？

默认在EO添加域名EO会发给你一个类似 `afo.im.eo.dnse4.com` 这样的CNAME

也就是 `你的域名.eo.dnse4.com` 

emm 这玩意吧 你们自己看速度吧

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/33a0b34f-d36f-4214-bcf3-616f9b174630.webp)

我推荐大家使用 `43.174.150.150` 。是一个中国香港的三网优化IP。速度如下。**本人EdgeOne优选：** `eo.072103.xyz`

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ab4cfd6f-ef23-4670-8577-02850f372124.webp)

# 换了CNAME后无法自动申请免费SSL？

如果你将你的域名托管给EO并且没有用EO给你的CNAME，则这个选项不可用

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/d81050d7-5d58-4b80-92d9-bf1e07285544.webp)

我推荐采用1panel、宝塔、acme.sh手动申请泛域名证书然后上传到腾讯云SSL控制台，就像这样

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/59cf2a66-2717-4291-b027-6cd2f270ece4.webp)

# EdgeOne怎么做重定向？

在这里

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/8f31d55f-4d0b-4209-935b-c2ec7924846c.webp)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/5ca74214-b4d0-4ac1-9fab-06d3096a5f7e.webp)

EO边缘函数也支持重定向，支持更细化的重定向规则

但是这玩意记录请求数，不如用Cloudflare的重定向规则

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2853531b-a57f-4b20-a8ec-98c0ca433604.webp)

首先我们在CF写这样一个规则
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ac9afee9-a368-4e10-a2a9-045e8672d636.webp)

然后让EO回源到CF边缘节点。最简单就是随便填个IP然后套CDN

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/08445fb0-892a-4793-a359-6cfc3194dbce.webp)

接着配置EO回源，这里一定要使用加速域名作为回源Host头

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/4911f0ca-86a0-42d3-90cf-ad2434f782ae.webp)

原理：用户 - EO - CF - CF识别到Host匹配重定向规则 - 301

# EdgeOne反代一切？

> 大部分情况将 `回源HOST头` 改为源站就能解决反代后网站无法访问的问题
> 
> ![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-04-12-00-41-image.png)
