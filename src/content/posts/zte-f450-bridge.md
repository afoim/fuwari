---
title: ZTE光猫F450不拆机获取超密
published: 2025-11-01T14:42:54
description: 朋友老早之前就想将光猫改为桥接，今天终于整上了，但奈何没有超密，不过，在互联网的帮助下，我们最终找到了解决方案
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/zte-f450-bridge-4.png
tags:
  - 破解
draft: false
lang: ""
---
> 参考：
> 
> [ZTE光猫F450不拆机获取超密_zxhnf450光猫超级密码-CSDN博客](https://blog.csdn.net/z47913/article/details/140727685)
> 
> [【网络】中兴天翼光猫F450/F650超管密码获取_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ri4y1h7Zo/?vd_source=6b94c66d8e200ba092130f674228bbff)

# 基本原理
通过外接USB通过官方的文件管理注入路径 `../..` 来查看根目录，并将记录了光猫超密的文件复制到U盘并进行解密读取以知晓超密

# 正式开始
首先准备一个U盘，**必须带有 FAT32 格式的分区**

插入光猫的USB口，等待识别

进入光猫的文件管理，查看U盘内文件。此时F12，选中其中一个文件夹，将 HTML 代码改为
```html
<a href="javascript:;" style="color:#535353;"
   onclick="openfile('../..', false)"
   title="System Volume Information">
  System Volume Information
</a>

```

然后点击该文件夹，等待几秒后就进入了光猫的 `/` 目录

复制 `/userconfig/cfg/db_user_cfg.xml` 到U盘

拔出U盘，插入电脑，将 `db_user_cfg.xml` 拿出

前往 [RouterPassView - 从 Windows 上的路由器备份文件中恢复丢失的密码](https://www.nirsoft.net/utils/router_password_recovery.html) 下载

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/zte-f450-bridge.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/zte-f450-bridge-1.png)

解压并使用 `RouterPassView` 打开 `db_user_cfg.xml` 

搜索 `tele` ，寻找超密

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/zte-f450-bridge-3.png)

