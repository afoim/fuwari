---
title: 你...买 Cloudflare Pro 了吗？来玩超级牛逼的 Snippets ！
published: 2026-03-18T18:53:50
description: Snippets 是 Cloudflare 提供的不限量不计费的轻量Worker，我们可以拿她干不少有趣的业务！
image: ../assets/images/snippets-1.png
draft: false
lang: ""
---
# 你...买Cloudflare Pro了吗？

虽然Snippets是一个Pro才能使用的功能

但其实也不一定要买，在一月份的Bug时期，部分免费域名可以免费得到5条Snippets，不过现在已经木大了

另一方面，如果你是一个开源开发者，并且你的开源项目关于或依托于 Cloudflare 运行，可以尝试申请Cloudflare的开源项目赞助计划：[Alexandria 项目 - 生日周 | Cloudflare](https://www.cloudflare.com/zh-cn/lp/project-alexandria/)

最后呢，如果你凑巧财力雄厚，可以直接花 25 刀买一个月的 Pro，Pro有25条Snippets规则，并且在到期后只是不能更改，但仍然可用。可以看作是1刀买一条规则吧，这样想想是不是还挺值的？

*Pro 还可以自定义WAF，几乎所有的功能相比 Free 都会多不少的份额，并且还会开放类似 Snippets 这种独占功能*

# Hmm...我拿到Snippets了，她能帮我做什么？

哦！那可以干很多事了！

首先我们先不谈能做什么，先谈谈这是什么吧！

Snippets ... 你可以把她看成 Worker 的妹妹，Snippets 只能在边缘运行JS代码，但无法原生与R2，D1，KV集成，或托管任何静态文件

*但也只是无法用官方API调用这些东西，我们仍然可以想办法用S3 API，RESTFul API，Graph QL API来从公网调用你想用的东西*

你可能感觉一般般？花钱买了阉割版？

不！Snippets 最牛逼的地方绝对不是她能做什么大展宏图的功能

而是 **不限量！不计费！** 

没错，只要你让一个Snippets跑起来了！她将在互联网上 **永生** *除了 Cloudflare 宕机* 在这期间无论是被打了亦或是被刷了都完全无法使她宕机

那么我们就能干很多事情了

什么 Github 代理啊... [GithubSiteProxyForCloudflareWorker/src/snippet.js at main · afoim/GithubSiteProxyForCloudflareWorker](https://github.com/afoim/GithubSiteProxyForCloudflareWorker/blob/main/src/snippet.js)

什么 Docker 代理啊... [CF-Workers-docker.io/snippet.js at main · afoim/CF-Workers-docker.io](https://github.com/afoim/CF-Workers-docker.io/blob/main/snippet.js)

什么 Telegram API代理啊... *自己找GPT写一个吧，很简单：`帮我编写一个适用于 Cloudflare Snippets 的反向代理脚本，目标为 api.telegram.org`*

又或是和你的静态随机图打打配合啊... [afoim/choice_randompic: 和 https://github.com/afoim/Static_RandomPicAPI 搭配使用，通过Snippet使得服务端返回302的随机图](https://github.com/afoim/choice_randompic)

甚至还可以连上一些免费的数据库帮你做点全栈应用？ *太懒了，我还没写qwq*

# 成果展示

- Github全站反代： https://gh.2x.nz
- Docker镜像源： https://docker.2x.nz
- Telegram API反代： https://tgapi.2x.nz
- 随机图： https://c-p.2x.nz/h

