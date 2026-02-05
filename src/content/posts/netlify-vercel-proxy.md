---
category: 随笔
description: 会用Netlify，家宽建站不是梦！
draft: false
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/nvp.png
lang: ""
published: 2025-04-04
tags:
  - Netlify
  - Vercel
title: Netlify、Vercel反代网站
---

# 原理思路

现阶段大部分家宽拿不到公网IPv4，但是可以拿到公网IPv6，借助Netlify做一个v6 -> v4的回源就可以让所有人都访问到你的站点了。同时这也是一个Netlify的通用反代教程。本文还教了Vercel的通用反代教程，不过这玩意在2025年仍然不支持IPv6，只能拿来反代小黄站了ToT
# 正式开始

## Netlify篇

首先前往 https://app.netlify.com/ 注册账号。（注意！最好使用谷歌邮箱去注册，其他方式注册可能会出现什么你的账号需要验证/激活，然后巴拉巴拉很麻烦）
接下来去Github开一个新仓库，根目录创建一个 `netlify.toml`。在其中写入

```toml
[[redirects]]
  from = "/*"
  to = "http://反代域名:反代端口/:splat"
  status = 200
  force = true
```

注意，端口后面的斜杠一定不要丢！
家宽v6网站建议搭配DDNS食用
接下来回到 https://app.netlify.com/ 创建一个新项目，导入你刚创建的Github项目，部署即可
最后绑定一下你的域名，完成！

## Vercel篇

首先前往 https://vercel.com/ 注册并登录你的账号
电脑安装Nodejs，我们需要用到npm
安装Vercel CLI

```
npm i -g vercel
```

登录Vercel CLI

```
vercel login
```

找个地方（比如桌面）创建一个你随意命名的文件夹，然后在其中创建一个你随意命名的.json文件，其中写入。**注意，目前Vercel不支持反代IPv6！！！**

```json
{
    "version": 2,
    "routes": [
      {"src": "/(.*)","dest": "https://反代域名:端口"}
    ]
}
```

然后部署

```
verceL -A 你随意命名的.json --prod
```

最后绑定一下你的域名，完成！