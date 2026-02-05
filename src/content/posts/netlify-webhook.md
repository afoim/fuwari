---
title: 利用Netlify WebHook来实时提醒你的订阅者博客文章更新
published: 2025-08-09T00:01:00
description: '早期提过使用Github WebHook来做到这件事，今天偶然发现了Netlify也可以做到同样的事情'
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-09-23-03-37-image.png'
tags: [Netlify]
category: '记录'
draft: false 
lang: ''
---

# 原理

早期文章提到过 [利用Github Webhook为你的订阅者推送文章更新消息](/posts/github-webhook)

其实已经很完美了，但是仍有一些缺陷

比如Github WebHook确实可以让Bot知道什么时候有了新的提交

但是Github并不知道构建服务需要构建多久

只能设置一个保守的延迟推送

但是当我们再使用Netlify的WebHook的时候

情况就变得不同了

Netlify可以在站点构建成功后向Bot发送WebHook

但是也有缺陷

那就是Netlify不支持检测文件变动

但是

我们只需要将两者结合

则工作流为
Push -> 

Github Webhook 通知Bot -> 

Bot收到提交信息，如果合法，则记录变动的文章，并且等待Netlify发送部署成功的WebHook -> 

Netlify WebHook 通知Bot站点部署成功 -> 

Bot即刻推送文章更新消息 √

# 实操

添加HTTP POST钩子

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-09-23-15-10-image.png)

创建一个部署成功钩子

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-09-23-15-40-image.png)

# Bot端

设置一个双监听WebHook服务器，同时接受Github和Netlify的WebHook即可。

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-09-23-36-50-5ec10aad91b98d8d36699c7956c705f0.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-09-23-39-27-cfc2d6a91a07455adbcee0c491143640.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-09-23-57-02-image.png)
