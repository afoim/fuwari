---
category: 教程
description: 因为本文涉猎敏感地带，所以仅供专业人士技术讨论，我也不会发布什么一键包，请按照教程自己动手
draft: false
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/36f34153-b96f-43ec-911e-8c3d65bc8aa0.webp
lang: ''
published: 2025-04-15
tags: [崩坏星穹铁道, DLL注入]
title: 崩坏星穹铁道全局加速
---
# 原理剖析

注入一个DLL实现绕过ACE反作弊，然后用CE的变速精灵

# 正式开始

确保你安装了Virtual Studio 2022 中的工作负载：使用C++的桌面开发

克隆DLL源码仓库：[GitHub - gmh5225/Honkai-StarRail-ACE-B: This repository provides code and instructions for bypassing the anti-cheat system in Honkai Star Rail game, allowing players to access previously restricted features and improve their gameplay experience. For informational purposes only. Use at your own risk.](https://github.com/gmh5225/Honkai-StarRail-ACE-B)

前往 [Releases · TsudaKageyu/minhook](https://github.com/TsudaKageyu/minhook/releases) 分别下载 `bin` 和 `lib` ，将其解压后寻找文件 `libMinHook.x64.lib` 和 `MinHook.h` 将其放到DLL源码仓库根目录

代码需要小改，这里省略

编译：

```shell
MSBuild star_rail.sln /p:Configuration=Release /p:Platform=x64 /property:GenerateFullPaths=true
```

产物在：

`\x64\Release\star_rail.dll` 

前往 [Releases · master131/ExtremeInjector](https://github.com/master131/ExtremeInjector/releases) 下载并解压，得到 `Extreme Injector v3.exe`

正常打开游戏，运行 `Extreme Injector v3.exe` ，选择游戏进程，注入刚刚编译出来的DLL

前往 https://www.cheatengine.org/ 下载CE，打开CE，如果游戏没有闪退或者弹出反作弊窗口，则证明注入成功。接下来选择游戏进程，开启变速精灵，2-5倍速即可。Enjoy it！