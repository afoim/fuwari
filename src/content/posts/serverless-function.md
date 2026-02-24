---
title: 盘点那些好用的Serverless（云函数）！
published: 2025-11-25T08:33:24
description: 你是否为了搭建一个网站而买了一台VPS，然后安装宝塔或1Panel再安装Nginx等等等等？现在这些统统不要！只需要稍加学习，你就可以得到一个免费的高可用的托管服务！
image: ../assets/images/serverless-function.webp
tags:
  - Serverless
  - 云函数
draft: false
lang: ""
---
# 何为Serverless
就像简介所说，传统来说我们搭建Web服务一般会选择买一个VPS，然后在其上安装管理面板，再安装所需软件，如Nginx，AList，最后运行，开放端口，再设置DNS解析，这样，一个网站就成功上线了

而Serverless就简单多了，毕竟 **Server** 被 **Less** 掉了

这又是什么意思呢？在Serverless服务里，你不再需要管理传统的VPS，而是直接将业务代码上传到目标平台，再由平台的CI/CD自动部署你的服务

举个不恰当的例子就比如你正在观看的这个 [博客](https://2x.nz) ，首先我将源码上传到 [边缘安全加速平台 EO Pages_腾讯云](https://cloud.tencent.com/document/product/1552/118260) ，再经由平台构建出最终的HTML页面，然后再在平台上绑定域名，直接访问就可以了

不难看出，在上一个例子中，我并没有去从零开始搭建这个服务，而是仅做了两件事：1. 源码上传 2. 绑定域名，而其他事情全部交给平台的自动化，这不仅极大减少了运维成本，并且在做版本控制的时候也更加容易

# Serverless的利与弊
在Serverless中，你不再需要管理基础设施，只需要确保你的代码能跑，然后直接上传到平台，平台会帮你做好后续工作

并且，这往往是 **免费** 的，或者说，大部分Serverless平台都有 **免费层** 。因为在平台看来，你只是租用了你所需要的东西，相比于哪些大客户，你的开销可以说是忽略不计

并且在Serverless中，你永远只是用户，但是如果你买的是VPS，一般来说你是可以完全控制这台VPS的，如设置防火墙，或是重装系统，而这种代价是高昂的，这也是为什么你能看到许许多多免费的Serverless服务，但是几乎看不到免费的VPS提供商

但这也有一些弊端，Serverless往往有严格的用量限制，在传统的VPS中，往往IDC会限制你的 **最大带宽**、**公网IP**  和 **总流量** ，但是在Serverless中，往往只会限制你的 **总流量** ，但可能还会有一些限制，如：**CPU最长执行时间** 、**总请求数** 、**函数总请求数** 、**函数最长执行时间** 等等等等

因为当你在用Serverless的时候，你的服务直接跑在其平台的CDN上的，你将直接享有所属平台的CDN IP段以及带宽，这也让平台的管理更加方便，不需要大量购入物理机开虚拟机做VPS，只需要做一个小集群并做好用户分配即可

Serverless也比Server更容易做版本控制和Debug，由于Serverless和Git是天生一体的。在用户看来，只需要先将代码托管到Github，再将代码库连接到Serverless平台，此后，你的服务每一次更新就只需要更新源码了，平台会自动帮你构建。当你想要回滚版本的时候，直接将部署回退为之前的提交即可，而Debug无需再连到服务器上做，只需要有一台电脑，将代码拉下来，本地Dev Debug后，再将修复后的代码提交，平台就能自动部署了

# 好用的Serverless平台

### [边缘全栈开发平台 - EdgeOne Pages](https://pages.edgeone.ai/zh)

:::caution
请不要在其上部署日流量超 **10M** 的服务，很有可能会被停用账号
:::

支持原生JS和Node Function，如果你的项目是基于Node打造的，仅需修改一下函数出入口即可无缝迁移。并且目前的 **Pages Function** 是 **不计请求也不计费** 的，非常适合部署一些仅自己用的服务

不过其自带的构建服务性能较低，上线速度可能稍慢

示例服务：  [自建一个匿名文件上传终结点 - AcoFork Blog](/posts/unknown-upload/)

### [Vercel Functions](https://vercel.com/docs/functions)
支持非常多的语言，如 Node.js、Python、Go、Wasm 等等。构建服务非常强劲！**默认分配 4C8G** 帮你构建！

用量限制非常宽松，并且可以超过限制的 **2倍** 以上仍保持正常访问
![](../assets/images/serverless-function-1.webp)
示例服务： [来！让我们用Vercel来分享你的OneDrive！ - AcoFork Blog](/posts/onedrive-index/)

### [Netlify Functions](https://www.netlify.com/platform/core/functions/)
支持 JS/TS 和 Go。用量限制更宽松！仅限制每个月100G传输流量，但是一旦超限，即刻宕机

示例服务： https://nf-gh.072103.xyz/afoim

### [Cloudflare Workers | 利用易于使用的开发工具构建和部署代码 | Cloudflare](https://www.cloudflare-cn.com/developer-platform/products/workers/)
支持众多语言，但是对JS/TS的支持最好，特别注意不支持完整的 **Node.js** 环境。Python目前无法通过pip安装包。优点在于可以和更多Cloudflare产品做协同，如Cloudflare R2 对象存储、Cloudflare KV 键值对存储、Cloudflare D1 SQL数据库

每天限制 **10W** 请求，但是超了并不会 **始终返回** 不可用，而是 **可能会请求错误** 

示例服务： [你可曾想过，直接将BitWarden部署到Cloudflare Worker？ - AcoFork Blog](/posts/warden-worker/)

### [Hugging Face – The AI community building the future.](https://huggingface.co/)

:::caution
请不要在其上部署 **AList** ！秒封！
:::

严格意义上来说，这是个帮你跑AI大模型服务的平台，但是由于它支持跑 **Docker** ，可玩性还是很高的

不过访问链接需要你拼一下： https://用户名-Space名.hf.space/

示例服务： [网易云音乐工具箱](https://acofork1-netease.hf.space/)

### [ClawCloud Run | Build, Deploy, Manage & Run in Cloud-Native Platform](https://run.claw.cloud/)

之前被干爆过，目前亚太爆炸，每个月有 **5 美元** 余额，直接跑Docker，按你分配的CPU核心数和内存来计费。不过 Hobby 计划还蛮便宜的，常用的话可以买
![](../assets/images/serverless-function-2.webp)

### [Render](https://render.com/)
![](../assets/images/serverless-function-3.webp)
**每月免费100G流量**，支持非常多的服务，如：静态网站、Web服务（Docker）、定时服务、PostgreSQL数据库、Key Vaule存储

唯一的缺点，性能不高

### [Zeabur](https://zeabur.com/zh-CN/)
![](../assets/images/serverless-function-4.webp)
**每月免费5刀额度** ，免费计划有两个地域可选
![](../assets/images/serverless-function-5.webp)

最重磅的在于你可以将自己的VPS托管给Zeabur，它会在你的服务器上安装k3s等服务，之后你就可以直接在Zeabur的仪表盘上进行运维了

**最小服务器要求：2GB 内存，1 核 CPU。**

![](../assets/images/serverless-function-6.webp)

# 结语
Serverless不像传统的VPS，你并不完全拥有它，所以有些服务是不能跑的， **特别是在免费层** ，如特别吃IO和网络的 **AList** ，或是并发请求特别高以及商用服务。如果你用的舒心，请考虑购买各大平台的付费版套餐