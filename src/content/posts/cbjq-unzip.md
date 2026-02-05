---
title: 记录解包尘白禁区以获得涩涩（？）CG
published: 2025-08-24T01:11:44
description: '受人委托解包尘白禁区的加载图CG，记录一下流程，方便日后复习'
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-13-41-3824c5ece06cc56241688f4a4aacbcbd.png'
tags: [尘白禁区, 解包]
category: '记录'
draft: false 
lang: ''
---

> 参考了 [虚幻4游戏解包导出及Mod制作指南 - 知乎](https://zhuanlan.zhihu.com/p/7144045084)

# 下载尘白禁区

前往 https://www.cbjq.com/ 下载并安装尘白禁区，确保启动器内可以直接开始游戏（即游戏完整包体已下载到你的电脑）

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-16-37-image.png)

# 确认虚幻引擎版本

导航到放置尘白禁区游戏本体的EXE的目录，如

```bash
C:\SeasunCBJQos\Game\cbjq\game\Game\Binaries\Win64
```

右键 `Game.exe` ，单击属性，转到 `详细信息` 一栏。可以看到是 `UE4 4.26` 。记住他，后文要用

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-18-47-image.png)

# 将有关CG的PAK文件分离出来

前往

```bash
C:\SeasunCBJQos\Game\cbjq\game\Game\Content\Paks
```

这里列出了所有的PAK文件，由于我们只需要CG图，故也只需要解包类似 `PAK_Game_UI_X-WindowsNoEditor.pak` 这样的文件

将其分离到一个单独的文件夹

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-22-23-image.png)

# 解包

下载解包脚本 https://r2.072103.xyz/snowbreak.bms

前往 [Luigi Auriemma](https://aluigi.altervista.org/quickbms.htm) 下载 `QuickBMS` 

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-22-37-image.png)

打开 

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-22-58-image.png)

第一步 选择解包脚本

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-25-15-image.png)

第二步 选择原始PAK文件所在的文件夹。选中文件夹后，在文件名输入 `*` 即可

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-25-58-image.png)

第三步 选择解包后输出目录

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-26-32-image.png)

等待解包

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-26-55-33683f308e84beb12f81c22c9702a4a4.png)

解包完成

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-28-27-image.png)

# 查看解包后的文件

解包后我们就得到了一般UE引擎封装的 `.uasset` 文件

我们需要使用另一个工具将其导出为一般格式的文件

前往 [UE Viewer | Gildor's Homepage](https://www.gildor.org/en/projects/umodel#files) 。点击 `Win32 Version` 下载

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-30-01-image.png)

打开 `umodel_64.exe` 。 `Path to game files:` 填写通过 `QuickBMS` 解包后的输出文件夹，勾选 `Override game detection` 并选择 UE4 4.26，也就是最开始我们获取的虚幻引擎版本

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-32-43-image.png)

这样就可以在 `UE Viewer` 里面查看 `.uasset` 文件了。但是这个文件浏览器很难用，我推荐导出后使用Windows资源管理器查看

右键你要导出的文件夹，比如 `All Package` 或者 `Game` ，点击 `Export folder content` 。可以选择一下输出文件夹，我这边是默认

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-35-49-image.png)

接下来你就可以在你设置的导出文件夹查看到所有一般格式的资源文件了，比如

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-36-37-image.png)

# 获取CG图

全局搜索关键字 `PlotCG` 就可以啦

导出后的图片CG文件为 `.TGA` 文件，是无损图像格式，我们可以通过 [BandiView - 图像查看器、快速且强大](https://www.bandisoft.com/bandiview/) 来查看

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-08-24-01-37-40-3824c5ece06cc56241688f4a4aacbcbd.png)
