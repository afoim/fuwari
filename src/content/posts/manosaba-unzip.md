---
title: 魔法少女的魔女审判解包（Unity通用解包方案）
published: 2025-10-05T16:09:36
description: 魔判这部作品真的很不错，大家可以去Steam搜索魔法少女的魔女审判下载下来玩玩
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/212792e5-8634-4121-984b-c3477f463897.png
tags:
  - 解包
  - 魔法少女的魔女审判
draft: false
lang: ""
---
# 正式开始
前往 https://github.com/AssetRipper/ ，下载 **AssetRipper** 并打开

这会自动调用浏览器并导向 `http://127.0.0.1:64203` 暂时放一边

接下来在Steam页面对游戏右键并选择 `管理 - 浏览本地文件`
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-1.png)
会打开你的文件资源管理器并导向该游戏位于系统中的实际路径 ![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-2.png)
点击 `地址栏` 然后复制
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-3.png)
此时在 **AssetRipper** 中我们选择 `文件 - 打开文件夹` 并粘贴路径，并进入 `*_Data` 文件夹，这里为 **manosaba_Data** 
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip.png)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-5.png)
接下来会进入漫长的等待时间。网页会卡在加载，我们可以查看一并打开的命令窗口确认资源载入进度
当你发现 **查看已导入文件** 可被点击后，方可继续
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-6.png)
选择右上角的 `导出 - 导出所有文件`
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-7.png)
点击选择文件夹，随便选个位置放解包后的文件
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-8.png)
然后点击 **导出主要内容**
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-9.png)
最终，寻找类似 `Assets` 文件夹，就有所有的资源文件了（如CG图，MV，角色语音等）
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/manosaba-unzip-10.png)

注：某些资源为骨骼/模型和动作文件，游戏进行中显现的2D图并非直接由静态文件提供，而是骨骼/模型和动作文件协作而成，对于这些内容，你需要自己拼出完整的资源画面，在此不做讨论