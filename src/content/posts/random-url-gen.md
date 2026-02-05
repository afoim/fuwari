---
title: 完全免费！从架构，开发到部署，一条龙实打实的教你做一言/随机图等随机URL的最佳实践
published: 2025-12-29T10:10:40
description: 我曾于2024搭建了第一个随机图网站，最近几周又深度研究了类似项目，发现这类项目有很多坑也有很多神秘的捷径，并且某些架构还可以做到“永生”...
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen.png
draft: false
lang: ""
---
# 探索架构
我们先不讲一个抽象的概念，我们首先来做一个小项目

**一个随机图API，每次请求都返回不同的图片**

你会怎么做？

有非常多的解决方案，就拿最简单的一说，我们可以先搞来一个服务器，然后往里面塞图片，最后写一个脚本创建一个Web服务器，接收客户端请求，每一个请求都从图片库里抽一张图返回

能实现吗？

当然可以！这是你的流程图！
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen-5.png)
但也会带来一些问题，比如，图片存在本地，给客户端响应图片的时候走的是你机子的流量，那么你就需要一个 **高带宽** 的服务器，这无疑是一个 **高昂** 的成本

那可能你会有新的方案： **前后端分离** （逻辑与资产分离），只将返回这个图片的逻辑存放在服务器上，而图片存到其他地方，如对象存储（Cloudflare R2）、IPFS等等
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen-6.png)
那么问题又来了，假如说你的项目太多人用了，那你的服务器性能可能不够，在后期，你仍然需要一个 **高昂** 的 **维护成本** 

那么那么那么，现在是 **2025** 年，传统的架构已经无法满足我们了，我们不妨可以试试 **云函数** 
仍然是前后端分离，我们现在将逻辑放到一个函数上面，如Cloudflare Worker、EdgeOne Function、Vercel Function等等
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen-8.png)
那么现在是不是无敌了？

并非，虽然前端因为使用了 **云函数** 也就是直接接入了CDN，高并发已经不是问题了，但是由于资产并不直接托管在 **云函数** 中，**云函数** 仍然需要创建一个长连接从你的后端，如对象存储获取图片，这样一折腾，你的服务可能并不算快

有人就会说了，那既然现在我都把我服务器丢了，前端在云，后端也在云，为什么不直接让前端的云直接存储后端的资产呢？

当然可以！你已经非常接近最佳实践了！

绝大部分 **云函数** 都支持动静结合，也就是支持你在他们的云存放一些动态脚本，再顺便 **存放静态资产** 

那么接下来，你就得到了一个完全不需要你买服务器托管，也不需要你担心存储爆仓导致天价账单的随机图...了吗？

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen-4.png)
# 探索随机图（随机URL）的本质
我们刚刚只是在抽象的说明某种架构 **好像** 可行，**好像** 又有什么问题，然后又有一种什么新思路 **好像** 可以解决这个问题

但我们要走的路才刚刚开始，我们不妨思考一下，随机图，又或者说随机URL这类项目，服务器（如果有）究竟发送了什么给客户端，客户端又对服务器发回的报文执行了什么动作

你肯定知道，如果想要客户端每次请求同一个URL，都返回不同的东西，那肯定是服务器针对每一个请求都返回了不同的响应，它可以是内部的，比如直接在响应体塞图片，又或者也可以是 **重定向**

直接在响应体塞图片很简单，在客户端是不可见的，当客户端请求API时，服务器直接将选中的图片作为响应体发出，在客户端看来，就好像是请求了一张图片，只不过每次刷新都不一样

而响应 **重定向** 就更简单了，只需要让服务器发送一个 **临时重定向** 的状态码，比如 **302** 

有人就会说了，为什么必须要 **临时重定向** ？

因为你肯定是想要客户端每次刷新都返回不同的图，一旦你使用了 **永久重定向** 如 **301** ，客户端在收到 **301** 的那一刻就会在浏览器里写一个记录：**下次访问这个URL直接重定向，不再请求服务器** ，这就会导致你的随机图API真的就变成一张图片了

那么，这两种方法哪种更好呢？

各有利弊，一句话说明：**直接返回MIME类型是连请求复用，仅需一次请求即可得到图片。而返回302重定向至少需要客户端请求两次** 

这得看你的实际架构，如果说你是前后端分离，即逻辑和资产不在一个地方，肯定是 302 好，因为如果你直接在响应体塞图片，就相当于你的服务器作为 **代理** 让客户端访问你的资产，流量全部走你服务器

而如果说你前后端都在一起，正常情况下来说，一次请求复用肯定是比两次连接更快的，不过为了方便管理和统计，我的大部分API仍然使用 **302 重定向** 

::github{repo="afoim/EdgeOne_Function_PicAPI"}

上线的API： https://eopfapi.acofork.com/pic?img=ua
# 奇技淫巧1：利用Cloudflare Origin Rules实现无计费的随机URL
> Video: https://www.bilibili.com/video/BV19ZBzB8EDQ/
起因于有一天一位粉丝在我视频下留言
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen-9.png)

他提到的仓库为

::github{repo="Mabbs/cf-hitokoto"}

大致为，Cloudflare在规则提供一个方法，该方法可以在规则层生成一个UUID，而UUID每次都是随机的，我们可以依据此来在规则层做随机URL

理论可行，实践开始

首先，我们要知道UUID是一串带有连字符的随机数，而每一位有16种可能，我们可以仅截取前4位，也就是 16^4 ，共能存储65536张图，每一张图可以分配到一个唯一的UUID，接下来让CF边缘在收到请求的时候，生成UUID，然后直接拼接URL请求静态资产，如 `/img/0000.jpg` ，再返回给客户端即可

那如果说我图比这多呢？加一位，16^5 = 1048576，够用了吧
那如果说我图比这少呢？那我们可以让图片填充，说个极端的例子，假如你只有2张图，每张图创建32768个副本即可，依此类推

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen-10.png)

::github{repo="afoim/cf-rule-random-url"}

上线的API： https://img.072103.xyz/h | https://img.072103.xyz/v

# 奇技淫巧2：丢掉后端，让前端JS自己拼URL
> Video: https://www.bilibili.com/video/BV1tNB4BEEaE/ 
> Video2: https://www.bilibili.com/video/BV1mMBKBREkB/

把思路打开，我们真的需要一个 **请求一个端点，返回一个随机内容** 的东西吗

如果只是想在我们的网站上用上随机图，那是不是可以让客户端JavaScript代劳呢

大致原理为编写一个客户端JS，生成一个随机数，然后拼接URL得到最终的随机图，然后寻找需要替换为随机图的img容器或者背景图容器，替换其中内容

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/random-url-gen-11.png)

::github{repo="afoim/Static_RandomPicAPI"}

上线的 API： https://pic1.acofork.com

# 总结
我们共探索了三种流派

- 传统派：中规中矩，在边缘函数找图，取图
- 极客派：通过CF的规则实现在边缘找图，取图，但是不计费
- 环保派：通过客户端JS直接在浏览器上实现找图，取图，改图