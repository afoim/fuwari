---
title: 你真的玩懂了Cloudflare SaaS吗？为什么经由SaaS的流量可以做优选？
published: 2026-01-16T20:16:09
description: 我们都知道，可以通过SaaS来做优选，但是为什么用SaaS就能做优选呢，为什么直接CNAME就不能优选呢？这篇文章带你一窥真相！
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cf-saas.png
draft: false
lang: ""
---
# 前言
Cloudflare SaaS是一个不需要你改变一个域名的NS服务器，就可以让其受益于Cloudflare网络

# 原理
首先我们要知道CDN是如何通过不同域名给不同内容的

我们可以将其抽象为2层，规则层和解析层。当我们普通的在Cloudflare添加一条开启了小黄云的解析。Cloudflare会为我们做两件事，1是帮我们写一条DNS解析指向Cloudflare，2是在Cloudflare创建一条路由规则

如果说你想要优选，实际上你是要手动更改这个DNS解析，使其指向一个更快的Cloudflare节点

但是，一旦你将小黄云关闭，路由规则也会被删除，再访问就会显示DNS直接指向IP

再但是，如果你使用SaaS，你就会发现Cloudflare不再帮你做这两件事了，这两件事你都可以自己做了

写一条SaaS规则+你自己写一条CNAME解析到优选节点，完全就可以做到优选了

具体如何创建一个SaaS规则可以前往 [Cloudflare 优选](/posts/cf-fastip/) 查看

# SaaS后，就是一家人了
如果一个域名已经被SaaS到一个已经在Cloudflare的域名，将完整受益所有Cloudflare服务

如我将 umami.acofork.com SaaS 到 2x.nz ，我就可以在 2x.nz 里为 umami.acofork.com 写规则了
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cf-saas-1.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cf-saas-2.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cf-saas-3.png)
Worker中的路由规则也适用
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cf-saas-4.png)