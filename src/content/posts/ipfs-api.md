---
title: 分享一个IPFS图片API
published: 2025-07-04
description: '很早前我就用过xLog，这次逆向出了它的图床API，可以用来暂时存放图片！'
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2a104c9e-195b-4f16-b080-ee76c763a80a.webp
tags: [IPFS]
category: '记录'
draft: false 
lang: ''
---

# 正式开始

> 该API为[xLog](https://xlog.app)的图床API

POST https://ipfs-relay.crossbell.io/upload

头无鉴权

body使用 `from-data` ，key为 `file` vlaue选择一个图片文件，不宜太大，会报错

示例Curl

```bash
curl --location 'https://ipfs-relay.crossbell.io/upload' \
--form 'file=@"/C:/Users/AcoFork/Pictures/b_53bb4f7fa91d684e72b666504e3fcc1897.jpg"'
```

会返回

```json
{
    "status": "ok",
    "cid": "QmVHG3KdGs3M8otdqjZEei6AzWt1usWRP6UmfLMbEub5nc",
    "url": "ipfs://QmVHG3KdGs3M8otdqjZEei6AzWt1usWRP6UmfLMbEub5nc",
    "web2url": "https://ipfs.crossbell.io/ipfs/QmVHG3KdGs3M8otdqjZEei6AzWt1usWRP6UmfLMbEub5nc",
    "fileSize": "77199",
    "gnfd_id": null,
    "gnfd_txn": null
}
```

其中， `web2url` 就是可以直接访问的URL，无CORS限制

![](https://eo-r2.2x.nz/myblog/img/Qmb7hj9NHf9XdSZQ2dsqcSUpdrTuhjbpKJsTqG84X7rFqw.png)
