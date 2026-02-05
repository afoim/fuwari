---
category: 记录
description: 本文深度剖析浏览器的JS运行原理以及浏览器内部事件处理的根本操作：事件循环
draft: false
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/4b040799-eec9-457e-a04e-edf8b7e35b94.webp
lang: ''
published: 2025-04-25
tags:
- 浏览器
- JS
title: 浏览器JS运行原理
---
# 引言：以下JS代码运行的结果是什么？

```js
function a() {
    console.log("1");
    Promise.resolve().then(() => {
        console.log("2");
    });
}
setTimeout(function () {
    console.log("3");
    Promise.resolve().then(a);
}, 0);

Promise.resolve().then(function () {
    console.log("4");
});

console.log("5");
```

# 浏览器是如何按部就班执行命令的？

浏览器的所有操作都由**渲染主线程**执行，渲染主线程将创建一个无限循环的任务执行已有的任务，当渲染主线程无任务时将从**消息队列**中拿取新的任务执行。**所有任务遵循先来后到，不允许插队执行**

视频分析：

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=114398232385591&bvid=BV1VpLJzPEBp&cid=29606019473&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>