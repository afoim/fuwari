---
title: 静态网站也需要WAF？Cloudflare不需要但是EdgeOne/ESA需要！
published: 2026-01-18
description: 在几周前，我的网站累计被DDoS了约100TB的流量，哪怕我是静态网站，并不会被“打死”，但因为流量过大，还是被EdgeOne取消接入了，其实这件事本不会发生...
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/waf.png
draft: false
lang: ""
---
# 静态网站能不能被打死？
首先，先给结论：

如果你托管在 **Cloudflare Page** ，那确实不用担心，因为它既不对静态请求计费，自身的CDN网络也足够强大，只要不是一天一PB，都是稳如老狗的

但是，如果你托管在 **EdgeOne/ESA** 等计费平台，是 **可以被打死** 的

有人就会问了： 我都是静态网站了，源站都没有，怎么能被打死呢？

是的，你的确没有源站，静态网站也不计请求数，但是如果你任何防护都不配，所有人，或者说所有IP都可以批量刷取你站的流量，一天刷个几TB。几天后，**CDN方可能就会给你取消接入了** 

那么我们要解决的问题也就明晰了，其实跟动态网站一样，本质就是： **让网站尽可能服务真实用户** 。只不过对于动态站，这是为了 **防止源站被打死** ，而对于静态网站，是为了 **CDN看到大额流量** 

# 如何做WAF？
首先，如果你使用的CDN是国内节点，就直接拦截海外访问

因为大部分刷子的IP都来自海外（大陆IP金贵），直接拦截可以很好防止大文件被刷取，如图片等。我就是个例子
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/waf-1.png)

其实做好这一步，你已经 **99%** 不会被刷死了，因为海外刷子本来可以刷 **100~1000KB**不等的图片，但现在只能刷 **拦截页面** 了（一般不到 **5KB** ），而一般拦截页面没有太多信息，甚至有些平台能自定义拦截页面，使其返回空报文（**小于1KB**）

假如原本刷子可以拿 **十万个** IP刷死你，而现在刷子需要 **100 * 100000 个** IP才能刷死了 ，这无疑是个指数级别的增长，并且你还是静态站，刷死你除了让业务停机，你也不会收到任何账单，大部分刷子会放弃刷站

接下来我们仍然可以配置额外防护，比如 **速率限制**，**全局JS质询** 等，这些都是针对于真实访客无感的验证

对于 **速率限制** 。真实访客不会进你站疯狂按F5短时间刷大量请求

对于 **JS质询** 。真实访客是用 **浏览器** 访问的，而不是 **curl** **wget** **okhttp** **httpx** 等无JS执行模块的轻 **请求发生器** 访问的，所以建议开启全站JS拦截

接下来才是重磅的，如果你的站被刷特别严重，尽管在L7全拦截住了，但是流量还是止不住的被刷刷刷，那就不要犹豫，**关闭CDN的 HTTP 2.0** 

这是什么原理？我们都知道，在HTTP 2.0，引入了 **连接复用** ，也就是在一个TCP连接里面可以发很多HTTP请求，这无疑降低了攻击成本

**经过实测，关闭HTTP 2.0后，攻击者从1分钟刷50G暴跌到了10分钟刷5G** 
>视频： https://www.bilibili.com/video/BV1paryBeEbP/

# 总结：如何成为最耐刷的网站？

1. 拦截海外
2. 所有请求JS质询（注意不要质询到API）
3. 设置速率限制
4. 关闭CDN的HTTP 2.0
# 奇技淫巧

### ESA禁海外访问
针对于ESA，免费版用户可能无法设置区域限制
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/waf-3.png)

但是我们可以 **曲线救国** ，先设置一个规则将所有请求默认拦截，再判断是不是大陆IP，如果是，则跳过这个规则

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/waf-4.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/waf-5.png)

视频： https://www.bilibili.com/video/BV1fKimBnE3T/

### EdgeOne Page使用CDN WAF
EdgeOne是个奇葩，它的CDN和Page的WAF是分开的，并且Page的WAF防护非常烂，只能 **针对单个IP** 进行拦截
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/waf-8.png)

我们可以让CDN回源Page让Page吃上CDN的WAF策略，左边为CDN创建域名界面，右边悬浮窗为Page界面

> [!WARNING]
> 这样设置后你会在总览看到双倍的流量，因为CDN回源Page记一次，而Page真正提供源站内容再记一次。可以通过开启缓存来缓解

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/waf-7.png)