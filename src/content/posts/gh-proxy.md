---
category: 教程
description: 使用CF Worker进行Github全站代理，并且防止网站被Cloudflare投诉为钓鱼网站。同时这也是一个通用的二次重写反代
draft: false
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/8bb2d8ae-1703-44e8-9f3b-10b46ab69913.webp
lang: ''
published: 2025-04-15
tags: [Cloudflare Worker]
title: 使用Cloudflare Worker搭建Github全站代理（防钓鱼）
---
# 项目原理

针对于Github这样的网站，我们无法仅使用一个透明的反向代理指向 `Github.com` 来解决，因为Github官网还有许多外域依赖，比如 `raw.githubusercontent.com` ，所以我们还需要写一个逻辑，让Worker重写Github传回的HTML，将其中的外域改为我们自己的域，同时建立多个解析替代

假如说原来用户访问：

用户 -> github.com -> raw.githubusercontent.com（被github.com请求）

那么我们的代理就是

用户 -> gh.072103.xyz -> raw-githubusercontent-com.072103.xyz（被gh.072103.xyz请求）

然后针对于 gh.072103.xyz 的请求由Worker反代到 github.com，而针对于 raw-githubusercontent-com.072103.xyz 的请求由Worker反代到 raw.githubusercontent.com

注意！这样去反代主流网站后，不久你的网站就会被标记为（钓鱼站点），因为你原封不动的克隆了人家站点并且 **没有显式屏蔽登录页面**

所以接下来我们需要找到原站点的所有登录页逐一屏蔽，对于Github.com，我们需要屏蔽

`/` `/login` `/signup` `copilot`

你可以将其直接导向404，或者重定向到另外的网站，**只要不让你的用户能在你的反代网站上能登录就可以**

# 正式部署

> 教程视频： https://www.bilibili.com/video/BV1jGd6YpE8z

进入 dash.cloudflare.com

创建新Worker，选择Hello World模板

前往 [GitHub - afoim/GithubSiteProxyForCloudflareWorker: 这是一个基于Cloudflare Workers的GitHub代理服务，允许通过替代域名访问GitHub资源，解决某些网络环境下GitHub访问受限的问题。代理服务通过域名映射和资源转发，提供无缝的GitHub浏览体验。](https://github.com/afoim/GithubSiteProxyForCloudflareWorker) 复制 `worker.js` 代码粘贴到你的Worker

观察域名配置

```js
// 域名映射配置
const domain_mappings = {
  'github.com': 'gh.',
  'avatars.githubusercontent.com': 'avatars-githubusercontent-com.',
  'github.githubassets.com': 'github-githubassets-com.',
  'collector.github.com': 'collector-github-com.',
  'api.github.com': 'api-github-com.',
  'raw.githubusercontent.com': 'raw-githubusercontent-com.',
  'gist.githubusercontent.com': 'gist-githubusercontent-com.',
  'github.io': 'github-io.',
  'assets-cdn.github.com': 'assets-cdn-github-com.',
  'cdn.jsdelivr.net': 'cdn.jsdelivr-net.',
  'securitylab.github.com': 'securitylab-github-com.',
  'www.githubstatus.com': 'www-githubstatus-com.',
  'npmjs.com': 'npmjs-com.',
  'git-lfs.github.com': 'git-lfs-github-com.',
  'githubusercontent.com': 'githubusercontent-com.',
  'github.global.ssl.fastly.net': 'github-global-ssl-fastly-net.',
  'api.npms.io': 'api-npms-io.',
  'github.community': 'github-community.'
};
```

假如你的域名为 `abc.com`

你需要将

`gh.abc.com` 

`avatars-githubusercontent-com.abc.com`

...

绑定到你的Worker，随后访问 `gh.abc.com` 就能访问你自己的Github反代了


---

# 完整代码

参见Github仓库： https://github.com/afoim/GithubSiteProxyForCloudflareWorker

# 适用于高级玩家：

如果你想修改三级域名，比如将 `gh.abc.com` 改为 `github.abc.com` 等，直接更改域名映射配置对应键的值

可以添加和删除要重定向的路径，默认重定向到一个神秘的网站，都有注释，你可以自行更改

本项目也是一个任意全站反代模板，可以反代其他网站（注意需要大改代码）