---
title: NAT1开放内网网站
published: 2025-05-31
description: '利用CF动态重定向透过STUN+Lucky WebHook实时更新STUN端口实现NAT1家宽建站'
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/0aa77bad-482a-4b65-9a19-4f35acb570ba.webp
tags: [NAT1, Lucky, Cloudflare]
category: '教程'
draft: false 
lang: ''
---

# 配套视频

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=114597528936170&bvid=BV1hY7szUEbu&cid=30235755189&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

# 原理

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/7c517b72-8287-4707-8dff-12690a71d592.webp)

# 正式开始

### 创建必要的Cloudflare API令牌

创建拥有如下图权限的令牌，使得Lucky可以使用此令牌设置DDNS、签发SSL、更新Cloudflare动态重定向

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/890468f0-7e7f-42b9-ba57-f98e3b964626.webp)

### 创建基底Cloudflare动态重定向规则

如图填写，替换为你的域名
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/9c4a1cb0-d1c6-4e9b-b2bb-dfd6b6fe6306.webp)

表达式： `wildcard_replace(http.request.full_uri, "*://*.072103.xyz/*", "https://${2}.stun.072103.xyz:6666/${3}")`

观察网址，记录下如下图的数据

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/bdd05652-4676-418f-b8aa-1dfc5b3dfab1.webp)

打开开发者工具后，再保存，确保抓到这样的包，保存备用
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/60e191a3-c4d8-40a2-b9b7-13af0fae38ab.webp)

将 `dash.cloudflare.com/api` 改为 `api.cloudflare.com/client` 。将刚才获得的红框内的内容填写到 `rules` 后面

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/b1a7a07c-7b4b-49ff-a152-938e30d93ee6.webp)

如果你不是第一次更新，可能会带有一个 `"position":{"index":1},` 删除它，否则后面的WebHook将会出错。

将我们硬编码的 `6666` 端口改为Lucky STUN的变量 `#{port}`

---

最终我们记录了以下信息

```
https://api.cloudflare.com/client/v4/zones/f305febd3a25b5bb3a46b802328a75a8/rulesets/35218f125f7f4421b4c76314464689a2/rules/17228a4add70429c9cdd38eb7fec1d02

{"description":"stun","expression":"(http.host wildcard \"*.072103.xyz\" and not http.host in {\"pic.072103.xyz\" \"hpic.072103.xyz\"})","action":"redirect","action_parameters":{"from_value":{"status_code":301,"preserve_query_string":true,"target_url":{"expression":"wildcard_replace(http.request.full_uri, \"*://*.072103.xyz/*\", \"https://${2}.stun.072103.xyz:#{port}/${3}\")"}}},"enabled":true}
```

### 让Cloudflare接管 *.072103.xyz 的流量

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/72dd5daa-a10f-4fa1-816f-8be18abc2587.webp)

### 配置Lucky DDNS

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/bf6eafd3-3f7b-4a71-8c4f-c0bd34703eee.webp)

### 配置Lucky SSL/TLS证书

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/80fc1bda-334d-4444-b063-2d3202de8296.webp)

### 配置Lucky Web服务

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/8f64210e-2bb3-4014-96e7-3af577a722f0.webp)

### 配置Lucky STUN

注：我这里使用了路由器的端口转发，将Lucky的16666（Web服务）端口转发到了路由器的17777端口。如果你不会端口转发，请**不要启用** `不使用Lucky内置端口转发` 并且**目标端口**填写16666

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/88f5e404-271b-4d20-98c7-b7f39a9247b2.webp)

### 配置WebHook

如图配置

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/559bce4c-ed44-4523-a623-7058ef1082dc.webp)

接口地址：你之前记录的 `https://api.cloudflare.com/...`

请求方法： `PATCH` 或者 `POST`

请求头：

```
Authorization: Bearer 你的API令牌
Content-Type: application/json
```

请求体：你之前记录的 `{"description":...` 

# End.
