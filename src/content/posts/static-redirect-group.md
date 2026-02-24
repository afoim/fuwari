---
title: 完全免费！搭建一个自己的短链服务！
published: 2026-01-14T23:39:31
description: 利用Cloudflare Worker+Github搭建一个纯静态，刷不死的短链吧！
image: ../assets/images/static-redirect-group.webp
draft: false
lang: ""
---
# 前言
本来不应该有这篇文章的，因为这篇文章就是一个该项目的简单自部署教程，应该写到仓库的README中，本来应该是让AI代工的，但是我发现它非常执着于那个b Github Page+Cloudflare Worker的神奇前后端分离，而且徒增了不少工作。其实该项目仅需一个Cloudflare Worker就行了，所以既然都要我手写了，我氵篇文章也是合情合理的吧

# 项目原理
该项目和上一个短链项目差不多，但是更简化了一些东西

首先就是，这个项目我们将前后端揉在了一起，前端几乎不校验东西，所有校验在后端，也不用两个项目来回加规则了

由于该项目前端非常简单，就两个html（一个创建页面，一个重定向页面），所以将他们揉在一起也并不臃肿

再来，该项目不再使用Cloudflare服务端的 301/302 重定向，也就突破了2000个静态重定向的限制，理论上是无限，而是直接使用CDN对于静态资产命中404时会fullback到 404.html 再在该文件用 JavaScript 做短链查询和重定向（也就跟Nginx伪静态差不多）

再接着，如果一个pathname没命中任何规则，也会被catch到一个默认的回退源，可以兼容类似 https://2x.nz/posts/pin/ --> https://blog.acofork.com/posts/pin/ 

然后就是创建短链的逻辑，其实跟上一个项目差不多，就是Worker代理访问Github，改一下js，添加一条新的短链规则，然后推送，这会自动触发Cloudflare Worker的重新构建，稍等片刻后，访问新的 pathname 就可以得到正确的重定向了

最后就是我们支持了有效期，原理也非常简单，前端创建短链的时候给后端传一个什么时候过期的字段，后端再写入文件，最后借助 Github Action 的定时巡查清除过期短链

# 在哪搞个短链
我的 2x.nz 是在 https://porkbun.com 买的，一年一百左右。其他后缀也不错，如 `.im` `.mk`

# 正式搭建你的短链服务

首先，Fork仓库

::github{repo="afoim/Static_Redirect_Group"}

接下来，先更改一些硬编码的东西，由于Cloudflare Worker对于静态资产不能使用环境变量，所以有些东西是硬编码的，请在所有HTML文件中尝试搜索 `afoim` 进行更改，改成你的（你也可以多加一层，写一个配置，然后通过构建来注入内容，随你）

然后，请编辑js文件夹里面的短链，改为你想要的

再接着，创建一个Github Token，只需要有 `repo` 权限即可

继续，绑定机密环境变量，使用 `wrangler secret put XXX`

| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `GITHUB_TOKEN` | `ghp_xxxx...` | 刚才申请的 Token |
| `GITHUB_OWNER` | `你的GitHub用户名` | 例如 `afoim` |
| `GITHUB_REPO` | `Static_Redirect_Group` | 你的仓库名 |
| `BASE_DOMAIN` | `你的短链域名` | 例如 `u.2x.nz` 或 Worker 的默认域名 `xxx.workers.dev` |

此时，访问 `/_url` 即可创建你的短链

# 防护
建议保护创建短链的短链，防刷（或Cloudflare Turnstile、速率限制... 随你）

在Cloudflare创建一个WAF规则

当传入请求匹配时...
```sql
(http.host eq "你的域名" and (
  http.request.uri.path eq "/_url"
  or http.request.uri.path wildcard "/api/*"
))
```

然后采取措施…

**交互式质询** 

