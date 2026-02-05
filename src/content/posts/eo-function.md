---
title: 对标CF Worker？拿EdgeOne边缘函数做一个随机图API！
published: 2025-08-01
description: '很早就知道EdgeOne边缘函数，一直都没来得及体验，今天上手后发现它真的很强大'
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/6c1b4054-0a9a-42dd-a72b-d179216ac61f.webp'
tags: [EdgeOne]
category: '教程'
draft: false 
lang: ''
---

# 正式开始

前往 [afoim/EdgeOne_Function_PicAPI: 适用于EdgeOne边缘函数的随机图API](https://github.com/afoim/EdgeOne_Function_PicAPI)

复制 `worker.js` 代码

部署到EdgeOne边缘函数

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/4274a5c6-c3d5-468b-8c98-d515a0a22762.webp)

将代码开头的 `R2_CONFIG` 设为你自己的

```js
var R2_CONFIG = {
  region: 'auto',
  service: 's3',
  accountId: '',
  accessKeyId: '',
  secretAccessKey: '',
  bucketName: ''
};
```

配置你的R2，将横屏随机图放到 `ri/h` 和 `ri/v` 。保证跟代码中的路径一样

```js
    // 根据路径确定前缀
    var prefix = '';
    if (pathname === '/h') {
      prefix = 'ri/h/';
    } else if (pathname === '/v') {
      prefix = 'ri/v/';
    } else if (pathname === '/') {
```

访问 `/h` 则展示一张横屏随机图，访问 `/v` 则展示一张竖屏随机图

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/fe7629b7-2acd-4e84-bd0c-d66ee7a54528.webp)

如果需要绑定域名请设置触发规则

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/33d931d4-e7cd-4d5d-afd8-85b787524391.webp)

# 注意

边缘函数每月有300万次的请求数限制，暂不知道超出是否扣费
