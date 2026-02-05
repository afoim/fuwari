---
title: 让Vercel对接你的S3对象存储（仅下载）
published: 2025-05-05
description: '可能很多小伙伴都使用过对象存储，但是他们大部分都没一个图形界面，虽然近年来有了AList这么一个非常全能的服务，但是仍然需要独立服务器，本篇将使用Vercel Function搭建一个精美的S3文件下载'
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-05-05-07-45-06-image.png
tags: [Vercel, Nextjs]
category: '教程'
draft: false 
lang: ''
---

> 视频教程（推荐）： https://www.bilibili.com/video/BV17b5gz5Ea4

# 正式开始

使用方法非常简单，进入GitHub仓库：[GitHub - afoim/S3cloudrive-index: S3cloudrive public directory listing. Powered by Next.js.](https://github.com/afoim/S3cloudrive-index)

按照README部署即可

# 原理

采用Vercel Function登录S3，获取文件列表传递给前端拼接URL显示，原项目是对接的OneDrive：[iRedScarf/onedrive-index: OneDrive public directory listing, and One-Click Deploy to Vercel. Powered by Vercel and Next.js.](https://github.com/iRedScarf/onedrive-index)。本项目仅更改了后端对接的存储类型，理论上你可以三改后对接任意存储...

~~本人想对接天翼云盘PC的驱动，但是登录鉴权一直不会做，有没有人来帮帮我（）~~
