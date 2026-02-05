---
title: 利用Cloudflare Page提供的重定向功能实现无损耗、不限数量的静态重定向！
published: 2025-07-13
description: 'Cloudflare的重定向规则非常强大，但是如果直接使用重定向规则创建批量重定向会消耗很多的配额'
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/530d7a11-c9ea-45ed-905a-1e3965f3e3b3.webp
tags: [Cloudflare]
category: '教程'
draft: false 
lang: ''
---

# 快速上手！

直接 Fork我的 [仓库](https://github.com/afoim/Redirect_Group) 。

接着将该仓库连接到Cloudflare部署Worker或Page，然后绑定你的域名

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/0c99399a-5d25-4372-9f9b-79767c32d150.webp)

接着更改 `_redirects` 内的文件

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/f9476b1d-b047-441b-a742-58124032a91b.webp)

例如： 

```bash
/ https://www.afo.im/ 301
/test/* https://test.test/test/:splat 302
```

则意味着

访问 `/` 301 永久重定向到 `https://www.afo.im/` 

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/3f49855c-6835-423d-805c-4758f232d136.webp)

访问 `/test/*` 302 临时重定向到 `https://test.test/test/*`

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/f018f75a-83ae-435e-9fce-d81d331f6d2f.webp)

已经非常强大了。而且不占用重定向规则配额也不耗费Worker请求数！
