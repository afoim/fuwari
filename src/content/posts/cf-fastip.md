---
category: 教程
description: 使用SaaS、Worker以及各种奇技淫巧来让你的网站解析的IP进行分流优选，提高网站可用性和速度
draft: false
image: ../assets/images/cf-fastip-11.webp
lang: ""
published: 2026-01-11
tags:
  - Cloudflare SaaS
  - Cloudflare Byoip
title: 试试Cloudflare IP优选！让Cloudflare在国内再也不是减速器！
---
> 本教程初始发布时间为 25年6月

#### 未优选

![QmZoinxZgAzu7Skh7BqsxmDQGU1sXtLLskJcyQuRAQNKww.webp](../assets/images/098f9ee71ae62603022e542878673e19bdcaf196.webp)

#### 已优选

![](../assets/images/cf-fastip-11.webp)

---

# 什么是优选？

简单来说，**优选就是选择一个国内访问速度更快的Cloudflare节点**。

Cloudflare官方分配给我们的IP，在国内访问时延迟往往较高，甚至可能出现无法访问的情况。而通过优选，我们可以手动将域名解析到那些国内访问更快的Cloudflare IP，从而显著提升网站的访问速度和可用性。

从上面的对比图可以看到，优选过的网站响应速度有很大提升，出口IP也变多了。这能让你的网站可用性大大提高，并且加载速度显著变快。

要实现优选，我们需要做到两点：**自己控制路由规则** 和 **自己控制DNS解析**。通过Cloudflare SaaS或Worker路由，我们可以同时实现这两点，下面会详细讲解。

---

# 优选原理

首先我们要知道CDN是如何通过不同域名给不同内容的。

我们可以将其抽象为2层：**规则层**和**解析层**。当我们普通的在Cloudflare添加一条开启了小黄云的解析，Cloudflare会为我们做两件事：

1. 帮我们写一条DNS解析指向Cloudflare
2. 在Cloudflare创建一条路由规则

如果你想要优选，实际上你是要手动更改这个DNS解析，使其指向一个更快的Cloudflare节点。

但是，一旦你将小黄云关闭，路由规则也会被删除，再访问就会显示DNS直接指向IP——这就没法用了。

**而SaaS和Worker路由的出现改变了这一切。**

使用SaaS后，Cloudflare不再帮你做这两件事了，这两件事你都可以自己做了：

1. 你可以自己写一条SaaS规则（规则层）
2. 你可以自己写一条CNAME解析到优选节点（解析层）

使用Worker路由同理，你创建Worker路由规则后，DNS解析就可以随便指向任何优选节点了。

这就是为什么经由SaaS或Worker路由的流量可以做优选的原因。

---

# 选择优选域名

优选的核心就是选择一个国内访问速度更快的Cloudflare节点IP或域名。

## 传统优选域名

常用的社区优选域名：https://cf.090227.xyz

这些优选域名通常是通过扫描Cloudflare官方IP段，找出国内延迟最低的IP整理而成。

## Cloudflare Byoip 优选

> 还在用传统优选？来看看Cloudflare Byoip！

### 什么是Byoip？

Cloudflare Byoip（Bring Your Own IP），即如果用户自己拥有一个IP、IP段，可以将其托管给Cloudflare，并使其受益于Cloudflare全球网络的加速与安全。

人话讲就是，有一些IP不直接隶属于Cloudflare，但是我们CNAME到这个IP后仍然可以正常访问到我们部署在Cloudflare上的服务。这些IP可能并不是Anycast，但是国内延迟可能会明显优于Cloudflare的官方IP段。

### 如何找到Cloudflare Byoip？

可以前往 [AS209242 Cloudflare London, LLC details | Ipregistry](https://ipregistry.co/AS209242#ranges)

尝试使用ITDog强制绑定IP访问你的Cloudflare服务，不返回403即可。

> 我这里返回404是正常的，因为 r2.afo.im 直接连接到Cloudflare R2对象存储，直接访问就是404

![](../assets/images/838f685e-3913-4b21-995e-5ee149f4bffa.webp)

### 注意事项

有一些Byoip可能会强制跳转到它自己的网站。需要查看ITDog的测试日志是否有重定向，别让你的网站成为他人的引流站。

### 可以长久使用吗？

这些Byoip固然比Cloudflare官方IP段质量更好，但如果你真的要用，请设置好一个机器定时筛选不可用的IP，以及添加一些Cloudflare官方IP段，防止您的服务宕机。

---

# 各类优选方案

## Worker项目优选（最简单）

如果你需要优选 Page/Worker项目：

首先，如果你是Page，将项目转为Worker，具体AI一下即可。

接下来编写Worker路由，直接填写 `你的域名+ /*`

![](../assets/images/cf-fastip.png)

最后写一条DNS解析到想要的优选域名，完事！

![](../assets/images/cf-fastip-1.png)

不需要折腾SaaS，不需要多域名，就是这么简单！

---

## Worker路由反代全球并优选（进阶）

> 本方法的原理为通过Worker反代你的源站，然后将Worker的入口节点进行优选。此方法不是传统的优选，源站接收到的Hosts头仍然是直接指向源站的解析

创建一个Cloudflare Worker，写入代码：

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

创建路由：

![](../assets/images/56752d54-26a5-46f1-a7d9-a782ad9874cb.webp)

类似这样填写：

![](../assets/images/d025398c-39e3-4bd7-8d8f-2ce06a45007d.webp)

最后写一条DNS解析 `CNAME gitea.afo.im --> 优选域名` 即可

---

## Cloudflare R2 优选

首先，你先得有个R2实例

![](../assets/images/cf-fastip-4.png)

接着，你需要绑定一个自定义域

![](../assets/images/cf-fastip-5.png)

接着，前往你的域名 - 规则 - Cloud Connector

![](../assets/images/cf-fastip-6.png)

![](../assets/images/cf-fastip-7.png)

![](../assets/images/cf-fastip-8.png)

最后写一条解析指向优选域名 `fast-r2.2x.nz CNAME cf.090227.xyz`

---

## 传统SaaS优选

### SaaS做了什么？

Cloudflare SaaS是一个不需要你改变一个域名的NS服务器，就可以让其受益于Cloudflare网络的功能。

当一个域名被SaaS到一个已经在Cloudflare的域名后，它就完整受益所有Cloudflare服务。如我将 umami.acofork.com SaaS 到 2x.nz，我就可以在 2x.nz 里为 umami.acofork.com 写规则了：

![](../assets/images/cf-saas-1.webp)

![](../assets/images/cf-saas-2.webp)

![](../assets/images/cf-saas-3.webp)

Worker中的路由规则也适用：

![](../assets/images/cf-saas-4.webp)

### SaaS优选步骤

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

#### 准备工作

我们需要**一个域名或两个域名**（单域名直接用子域名即可。双域名比如：onani.cn和acofork.cn）。

> **如果在同一CF账号下不可用，请尝试将俩域名放置在不同账号**

这里我们让onani.cn成为主力域名，让acofork.cn成为辅助域名。

单域名效果：

![](../assets/images/cf-fastip.webp)

#### 具体步骤

1. 首先新建一个DNS解析，指向你的**源站**，**开启cf代理**
   ![QmfBKgDe77SpkUpjGdmsxqwU2UabvrDAw4c3bgFiWkZCna.webp](../assets/images/c94c34ee262fb51fb5697226ae0df2d804bf76fe.webp)

2. 前往**辅助域名**的 SSL/TLS -> 自定义主机名。设置回退源为你刚才的DNS解析的域名：xlog.acofork.cn（推荐 **HTTP 验证**）

3. 点击添加自定义主机名。设置一个自定义主机名，比如 `onani.cn`，然后选择**自定义源服务器**，填写第一步的域名，即 `xlog.acofork.cn`。
   
   如果你想要创建多个优选也就这样添加，一个自定义主机名对应一个自定义源服务器。如果你将源服务器设为默认，则源服务器是回退源指定的服务器，即 `xlog.acofork.cn`
   
   ![QmRYrwjeDMDQCj8G9RYkpjC3X4vpwE77wpNpbqKURwBber.webp](../assets/images/f6170f009c43f7c6bee4c2d29e2db7498fa1d0dc.webp)

4. 继续在你的辅助域名添加一条解析。CNAME到优选节点：如cloudflare.182682.xyz，**不开启cf代理**
   ![QmNwkMqDEkCGMu5jsgE6fj6qpupiqMrqqQtWeAmAJNJbC4.webp](../assets/images/4f9f727b0490e0b33d360a2363c1026003060b29.webp)

5. 最后在你的主力域名添加解析。域名为之前在辅助域名的自定义主机名（onani.cn），目标为刚才的cdn.acofork.cn，**不开启cf代理**
   ![QmeK3AZghae4J4LcJdbPMxBcmoNEeF3hXNBmtJaDki8HYt.webp](../assets/images/6f51cb2a42140a9bf364f88a5715291be616a254.webp)

6. 优选完毕，确保优选有效后尝试访问
   ![](../assets/images/cf-fastip-10.webp)

7. （可选）你也可以将cdn子域的NS服务器更改为阿里云\华为云\腾讯云云解析做线路分流解析

> 优选工作流：用户访问 -> 由于最终访问的域名设置了CNAME解析，所以实际上访问了cdn.acofork.cn，并且携带 **源主机名：onani.cn** -> 到达优选域名进行优选 -> 优选结束，cf边缘节点识别到了携带的 **源主机名：onani.cn** 查询发现了回退源 -> 回退到回退源内容（xlog.acofork.cn） -> 访问成功

---

# 针对于Cloudflare Page

1. 你可以直接将你绑定到Page的子域名直接更改NS服务器到阿里云\华为云\腾讯云云解析做线路分流解析

2. 将您的Page项目升级为Worker项目，使用Worker优选方案（更简单）。详细方法见：【CF Page一键迁移到Worker？好处都有啥？-哔哩哔哩】 https://www.bilibili.com/video/BV1wBTEzREcb

# 针对于Cloudflare Workers

1. 在Workers中添加路由，然后直接将你的路由域名从指向`xxx.worker.dev`改为优选域名即可
2. 如果是外域，SaaS后再添加路由即可，就像：
   ![](../assets/images/cf-fastip-12.webp)

   ![](../assets/images/cf-fastip-13.webp)

# 针对于Cloudflare Tunnel（ZeroTrust）

请先参照 [传统SaaS优选](#传统saas优选) 设置完毕，源站即为 Cloudflare Tunnel。正常做完SaaS接入即可：

![](../assets/images/cf-fastip-3.webp)

![](../assets/images/cf-fastip-2.webp)


接下来我们需要让 **最终访问的域名** 打到 Cloudflare Tunnel 的流量正确路由，否则访问时主机名不在Tunnel中，会触发 **catch: all** 规则，总之就是没法访问。再创建一个Tunnel规则，域名为 **你最终访问的域名** ，源站指定和刚才的一致即可。

![](../assets/images/cf-fastip-3.png)

最后写一条 `umami.2x.nz` CNAME **你自己的优选域名** 的DNS记录即可



---

# 针对于使用了各种CF规则的网站

你只需要让规则针对于你的 **最终访问域名** ，因为CF的规则是看主机名的，而不是看是由谁提供的。

# 针对于虚拟主机

保险起见，建议将源站和优选域名同时绑定到你的虚拟主机，保证能通再一个个删。
