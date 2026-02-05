---
title: 自建一个匿名文件上传终结点
published: 2025-11-08T11:02:04
description: 你有没有遇到过一种场景？在学校/公司电脑需要带一个文件走，但是又不想安装远程软件。那么今天，教你无需U盘，让你在任何地方将你想要的文件带回你家！
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/unknown-upload.png
tags:
  - EdgeOne
  - 对象存储
draft: false
lang: ""
---
# 视频
https://www.bilibili.com/video/BV1Hz1DBZEov/

# 明确需求

在做一个项目时，无论大小，首先我们要知道自己需要什么，哪些是刚需，哪些是次要的，哪些是根本不必要的

深度思考一下，我觉得该项目使用场景应该在：当我处于非家庭环境，且手上有一台不直通家庭网络但是可连接至互联网的设备，需要传输一些非敏感文件且文件不大（如：文档，截图，小软件）

那么大致的需求即为：
1. 基于Web网页，制作一个前端页面，必须包含一个 `input file` 。上传完成打印上传完成
2. 后端将文件放到一个存储空间。该存储空间必须在家庭网络内较方便的访问

# 梳理思路，决定架构

一开始我想用一种最简单的方法，这种方法无需编写任何代码。那就是使用 [【花生壳HFS for win 正式版】使用教程-贝锐花生壳官网](https://hsk.oray.com/news/14884.html) 。我只需要将该软件部署在我的家庭电脑，然后通过CDN将服务映射到公网即可。但这会遇到几个问题：
1. 若我的家庭电脑离线，服务将不可用
2. 使用时会占用家中的下载带宽

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/unknown-upload-1.png)

那么换个思路，我们是否可以借助对象存储？

当然可以，我只需要找一个云函数连接到我的对象存储，然后提供一个上传端点

# 正式开始

于是我找到了EdgeOne Pages，它的Functions非常适合做这件事，且支持原生Node运行时，也就是 `node-functions` 直接使用 `AWS-S3` 这个NPM包再做一个最简单的前端上传页面，搞定！

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/unknown-upload-2.png)

为了防止上传重名文件，每个文件上传后都会被重命名为 `原文件名_时间戳_IP` 

该项目已开源 [afoim/EdgeOnePageFunctionUnknownUploader-S3-](https://github.com/afoim/EdgeOnePageFunctionUnknownUploader-S3-)


