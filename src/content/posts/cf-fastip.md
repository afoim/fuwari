---
category: 教程
description: 使用SaaS、Worker以及各种奇技淫巧来让你的网站解析的IP进行分流优选，提高网站可用性和速度
draft: false
image: ../assets/images/cf-fastip-11.webp
lang: ""
published: 2026-01-11
tags:
  - Cloudflare SaaS
title: 试试Cloudflare IP优选！让Cloudflare在国内再也不是减速器！
---
> 本教程初始发布时间为 25年6月
#### 未优选

![QmZoinxZgAzu7Skh7BqsxmDQGU1sXtLLskJcyQuRAQNKww.webp](../assets/images/098f9ee71ae62603022e542878673e19bdcaf196.webp)

#### 已优选

![](../assets/images/cf-fastip-11.webp)

---

结论：可见，优选过的网站响应速度有很大提升，并且出口IP也变多了。这能让你的网站可用性大大提高，并且加载速度显著变快。

### Cloudflare优选域名： https://cf.090227.xyz

---

# Worker项目优选

如果你需要优选 Page/Worker项目

首先，如果你是Page，将项目转为Worker，具体AI一下即可

接下来编写Worker路由，直接填写 `你的域名+ /*` 

> 如果你的域名不在Cloudflare，请先SaaS进来，否则 **Worker 路由不生效** ，具体看 [你真的玩懂了Cloudflare SaaS吗？为什么经由SaaS的流量可以做优选？ - 《二叉树树》官方网站](/posts/cf-saas/)

![](../assets/images/cf-fastip.png)

最后写一条DNS解析到想要的优选域名，完事！

![](../assets/images/cf-fastip-1.png)

不需要折腾SaaS，不需要多域名，就是这么简单！

# Worker路由反代全球并优选（新）

> 本方法的原理为通过Worker反代你的源站，然后将Worker的入口节点进行优选。此方法不是传统的优选，源站接收到的Hosts头仍然是直接指向源站的解析
> 
> 以下代码是原Github全站反代代码的二改以实现Worker路由接入优选，可能有多余逻辑或者不完全适配于优选需求

创建一个Cloudflare Worker，写入代码

```js
// 域名前缀映射配置
const domain_mappings = {
  '源站.com': '最终访问头.',
//例如：
//'gitea.072103.xyz': 'gitea.',
//则你设置Worker路由为gitea.*都将会反代到gitea.072103.xyz
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const current_host = url.host;

  // 强制使用 HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return Response.redirect(url.href, 301);
  }

  const host_prefix = getProxyPrefix(current_host);
  if (!host_prefix) {
    return new Response('Proxy prefix not matched', { status: 404 });
  }

  // 查找对应目标域名
  let target_host = null;
  for (const [origin_domain, prefix] of Object.entries(domain_mappings)) {
    if (host_prefix === prefix) {
      target_host = origin_domain;
      break;
    }
  }

  if (!target_host) {
    return new Response('No matching target host for prefix', { status: 404 });
  }

  // 构造目标 URL
  const new_url = new URL(request.url);
  new_url.protocol = 'https:';
  new_url.host = target_host;

  // 创建新请求
  const new_headers = new Headers(request.headers);
  new_headers.set('Host', target_host);
  new_headers.set('Referer', new_url.href);

  try {
    const response = await fetch(new_url.href, {
      method: request.method,
      headers: new_headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'manual'
    });

    // 复制响应头并添加CORS
    const response_headers = new Headers(response.headers);
    response_headers.set('access-control-allow-origin', '*');
    response_headers.set('access-control-allow-credentials', 'true');
    response_headers.set('cache-control', 'public, max-age=600');
    response_headers.delete('content-security-policy');
    response_headers.delete('content-security-policy-report-only');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response_headers
    });
  } catch (err) {
    return new Response(`Proxy Error: ${err.message}`, { status: 502 });
  }
}

function getProxyPrefix(hostname) {
  for (const prefix of Object.values(domain_mappings)) {
    if (hostname.startsWith(prefix)) {
      return prefix;
    }
  }
  return null;
}
```

创建路由

![](../assets/images/56752d54-26a5-46f1-a7d9-a782ad9874cb.webp)

类似这样填写

![](../assets/images/d025398c-39e3-4bd7-8d8f-2ce06a45007d.webp)

最后写一条DNS解析 `CNAME gitea.afo.im --> 社区优选域名，如 cf.090227.xyz` 即可

# 传统优选

> 简单易懂（pro.yourdomain.com 是最终访问域名）：
> CF SaaS DNS
> origin.yourdomain.com -> 源站开小黄云
> cdn.yourdomain.com -> cf优选域名
> pro.yourdomain.com -> cdn.yourdomain.com
> 
> CF SaaS
> 添加自定义主机名pro.yourdomain.com
> 源站为origin.yourdomain.com

> [!WARNING]
> Cloudflare最近将新接入的域名SSL默认设为了完全，记得将 SSL 改为灵活。
> ![](../assets/images/cf-fastip-1.webp)

> 我们需要**一个域名或两个域名**（单域名直接用子域名即可。双域名比如：onani.cn和acofork.cn）。
> 
> **如果在同一CF账号下不可用，请尝试将俩域名放置在不同账号**

这里我们让onani.cn成为主力域名，让acofork.cn成为辅助域名

单域名效果
![](../assets/images/cf-fastip.webp)

---

1. 首先新建一个DNS解析，指向你的**源站**，**开启cf代理**
   ![QmfBKgDe77SpkUpjGdmsxqwU2UabvrDAw4c3bgFiWkZCna.webp](../assets/images/c94c34ee262fb51fb5697226ae0df2d804bf76fe.webp)

2. 前往**辅助域名**的 SSL/TLS -> 自定义主机名。设置回退源为你刚才的DNS解析的域名：xlog.acofork.cn（推荐 **HTTP 验证** ）

3. 点击添加自定义主机名。设置一个自定义主机名，比如 `onani.cn` ，然后选择**自定义源服务器**，填写第一步的域名，即 `xlog.acofork.cn` 。
   
   如果你想要创建多个优选也就这样添加，一个自定义主机名对应一个自定义源服务器。如果你将源服务器设为默认，则源服务器是回退源指定的服务器，即 `xlog.acofork.cn` 
   
   ![QmRYrwjeDMDQCj8G9RYkpjC3X4vpwE77wpNpbqKURwBber.webp](../assets/images/f6170f009c43f7c6bee4c2d29e2db7498fa1d0dc.webp)

3. 继续在你的辅助域名添加一条解析。CNAME到优选节点：如cloudflare.182682.xyz，**不开启cf代理** 
   ![QmNwkMqDEkCGMu5jsgE6fj6qpupiqMrqqQtWeAmAJNJbC4.webp](../assets/images/4f9f727b0490e0b33d360a2363c1026003060b29.webp)

4. 最后在你的主力域名添加解析。域名为之前在辅助域名的自定义主机名（onani.cn），目标为刚才的cdn.acofork.cn，**不开启cf代理**
   ![QmeK3AZghae4J4LcJdbPMxBcmoNEeF3hXNBmtJaDki8HYt.webp](../assets/images/6f51cb2a42140a9bf364f88a5715291be616a254.webp)

5. 优选完毕，确保优选有效后尝试访问
![](../assets/images/cf-fastip-10.webp)

6. （可选）你也可以将cdn子域的NS服务器更改为阿里云\华为云\腾讯云云解析做线路分流解析
   
   > 优选工作流：用户访问 -> 由于最终访问的域名设置了CNAME解析，所以实际上访问了cdn.acofork.cn，并且携带 **源主机名：onani.cn** -> 到达cloudflare.182682.xyz进行优选 -> 优选结束，cf边缘节点识别到了携带的 **源主机名：onani.cn** 查询发现了回退源 -> 回退到回退源内容（xlog.acofork.cn） -> 访问成功

# 针对于Cloudflare Page

1. 你可以直接将你绑定到Page的子域名直接更改NS服务器到阿里云\华为云\腾讯云云解析做线路分流解析

2. 将您的Page项目升级为Worker项目，使用下面的Worker优选方案（更简单）。详细方法见： 【CF Page一键迁移到Worker？好处都有啥？-哔哩哔哩】 https://b23.tv/t5Bfaq1

# 针对于Cloudflare Workers

1. 在Workers中添加路由，然后直接将你的路由域名从指向`xxx.worker.dev`改为`cloudflare.182682.xyz`等优选域名即可
2. 如果是外域，SaaS后再添加路由即可，就像
![](../assets/images/cf-fastip-12.webp)
![](../assets/images/cf-fastip-13.webp)

# 针对于Cloudflare Tunnel（ZeroTrust）
请先参照 [常规SaaS优选](#传统优选) 设置完毕，源站即为 Cloudflare Tunnel。正常做完SaaS接入即可
![](../assets/images/cf-fastip-2.webp)
![](../assets/images/cf-fastip-3.webp)

接下来我们需要让打到 Cloudflare Tunnel 的流量正确路由，否则访问时主机名不在Tunnel中，会触发 **catch: all** 规则，总之就是没法访问。首先随便点开一个隧道编辑
![](../assets/images/cf-fastip-4.webp)

打开浏览器F12，直接保存，抓包请求
![](../assets/images/cf-fastip-5.webp)

抓包 **PUT** 请求，右键复制为 **cURL**
![](../assets/images/cf-fastip-6.webp)

![](../assets/images/cf-fastip-7.webp)

打开 **Postman** 粘贴整个请求，导航到 **Body** 页，添加一个新项目， **hostname** 为你优选后（最终访问）的域名， **service** 为一个正确的源。然后 **Send** ！
![](../assets/images/cf-fastip-8.webp)

接下来，控制台会自动多出来一个新的域名，再次访问就正常了

*至于为什么要这么做，因为你要添加的域名可能并不在你的 Cloudflare 账户中，而控制台的添加仅能添加CF账户内的域名，所以需要抓包曲线救国*

![](../assets/images/cf-fastip-9.webp)

---

# 针对于使用了各种CF规则的网站
你只需要让规则针对于你的最终访问域名，因为CF的规则是看主机名的，而不是看是由谁提供的

# 针对于虚拟主机
保险起见，建议将源站和优选域名同时绑定到你的虚拟主机，保证能通再一个个删