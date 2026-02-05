---
title: EO VS ESA，谁才是国内CDNの王？！
published: 2026-01-16T16:53:08
description: EdgeOne和ESA都是非常好的免费国内CDN，常规用起来几乎一模一样，今天我们就来让他俩一决雌雄！
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa.png
draft: false
lang: ""
---
# 前言

首先，EdgeOne是来的最早的，于25年7月就开始测试了，而ESA是10月才开放的。

虽然EdgeOne在早期需要兑换码换免费套餐，而兑换码从早期的发推特然后找官方领码，再到Discord群组每天固定时间发码，最后到测速分享直接拿兑换码，门槛逐渐放低，功能逐渐齐全。

而ESA由于是后来者，直接给每个阿里云账户发了一个免费的ESA套餐，如果你有多站点接入的需求，也可以通过拉人头来得到更多的免费套餐。

就当前（26年1月）来说，两家的体验大差不差，但是EdgeOne和ESA的底层逻辑是有点区别的。

# 底层逻辑对比

EdgeOne这个项目，特别是Page，在24年就已经初具雏形并且能够像那些大厂如Cloudflare Page，Github Page，Vercel等静态托管平台一样使用了，但是当时一是腾讯是悄咪咪上的，二是节点实在是太烂了，只有海外新加坡节点，也不支持国内节点。

而ESA大概率是从老的DCDN和云函数FC改过来的，控制台就已经露出鸡脚了。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-1.png)

# 规则引擎与WAF

ESA的很多东西直接是照抄Cloudflare的，比如：

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-3.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-2.png)

并且还将每条规则（嵌套子规则也算一条）全部砍了一刀，免费套餐仅支持5条规则。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-4.png)

## EdgeOne 的优势

反观EdgeOne，它没有照抄Cloudflare，而是自己写了一套规则引擎，所有类型的规则都在一处地方配置，并且可以互相联动。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-5.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-6.png)

甚至你还可以对不合法请求在L7给空。（不推荐，规则引擎的假拦截也算正常请求）
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/1f63e461bfa538605c7734042edd68f6.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-7.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-8.png)

### 优先级陷阱

并且要注意一点，虽然你可以在规则引擎里伪装一个WAF拦截，但是在EdgeOne中，流量会先经由规则引擎，再经过WAF，也就是如果你在WAF写了个非CN拦截，然后在规则引擎里写个非CN给空，海外IP访问只能看到空响应，看不到拦截页面，流量也照记（难绷）。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-9.png)

## ESA 的策略

而ESA这边，WAF的优先级始终是最高的，流量会先被WAF网关审查，通过后才应用规则，但是免费套餐不支持在WAF中设置地域级别的拦截（难绷）。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-10.png)

### 曲线救国方案

但是有个曲线救国的方案，就是先写个规则将流量全拦截，然后再写个白名单规则，将可信流量绕过该规则。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-11.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-12.png)

# 回源配置

再接着就是因为ESA照抄Cloudflare，所以创建加速站点的时候默认是HTTP走80，HTTPS走443回源，如果你要更改回源的端口，还需要浪费一个回源规则。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-13.png)

而EdgeOne可以在创建站点的时候直接就设置回源端口以及回源Host。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-14.png)

# SSL 证书签发

再到SSL签发，首先两家都支持默认的CNAME签发，也就是你把域名解析到我这，我帮你签SSL，但是EdgeOne的CNAME签发是每一个站点单独签一次。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-15.png)

而ESA是统一管理，你给我个DCV，我直接给你签一个泛域名，之后你就用去吧。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-16.png)

# 规则隔离与互通

然后就是最重磅的，EdgeOne独属的左右脑互搏时刻。

在EdgeOne CDN和EdgeOne Page中，他俩的规则竟然不是互通的，CDN业务走CDN的规则，Page的规则走Page的规则，也行吧，他想做干湿分离，我配两套没问题。

## 功能阉割

但是！阉割是什么意思，为什么CDN可以写地域判断，Page就只能写IP？

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-17.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-18.png)

那么也没有什么让Page吃上CDN规则的方法呢？有的，兄弟有的（但是这样会在控制台看到双倍流量，如果你的Page纯静态，可以写个全缓存缓解一下）。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-19.png)

# Page 服务对比

接着到Page部分。

EdgeOne的Page你可以直接看作是Cloudflare Page的本地化，甚至突破了核心代码，直接可以在Page里面跑Nodejs服务，要知道，Cloudflare Page也只有一个V8环境（Umami也可以！SSR函数小于等于128MB即可）并且可以托管海量大和多的文件。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-20.png)

而ESA Page非常像云函数FC改过来的，虽然也支持函数吧，但没有完整的Nodejs环境，甚至最近WebSocket也被砍了（关闭后就打不开了），并且托管的文件数以及单文件大小如下限制。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eovsesa-21.png)

# 速度与限速

最后就是速度相关，根据多方数据以及自测，两个CDN都会在长时间的单IP上下行请求逐渐将速率削减至大约 500KB/s，但如果只是正常业务使用，短时间的突发速率都可以飙到50MB/s左右（但不能长期），所以这俩CDN都不适合反向代理对象存储以及大文件分发，如果有类似业务需求还是老实用Cloudflare，CF是不限速的。