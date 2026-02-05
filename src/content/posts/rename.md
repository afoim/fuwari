---
title: 记录一下批量重命名插件咋写的
published: 2025-09-06T01:59:26
description: '因为重装系统了，一些小插件丢失了，要重写，然后又把之前的坑踩了一遍'
image: 'https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-09-06-02-01-14-image.png'
tags: [Python]

draft: false 
lang: ''
---

# 正式开始

首先我让AI写一个批量重命名插件

```bash
编写一个重命名的脚本（Python）
让我通过 python xxx.py (目录)
传入一个目录，然后将内部的所有文件按照 1 2 3 4 5这样重命名，保留原后缀
```

然后AI写出来了，但是有一个交互

```bash
是否要对 xxx 进行批量重命名（Y/N）：
```

我就让他删掉

```bash
不要交互，直接运行
```

然后又出现了新问题，如果有一个文件，比如 `100.webp` 已经存在，然后在Python的默认排序中，`100.webp` 可能并不是第 **100** 个，也就是说会有别的文件将要被重命名为 `100.webp` 然后代码对于这样的文件会直接跳过，这就会导致重命名不完全

那么我就说

```bash
不要跳过 强制重命名
```

然后新的问题出现了：如果已经有一个文件为 `100.webp` 是无法将另一个文件也重命名为 `100.webp` 的，会报错

```bash
重命名文件 '716.webp' 失败: [WinError 183] 当文件已存在时，无法创建该文件。: 'C:\\Users\\acofork\\Pictures\\r1\\ri\\h\\716.webp' -> 'C:\\Users\\acofork\\Pictures\\r1\\ri\\h\\744.webp'
```

那么最后，我用了一个绝妙的办法

1. 将所有文件随机命名

2. 重新排序

3. 依次重命名

于是我继续说

```bash
先全部命名为 随机数，然后再重新命名
```

这下就对了

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/2025-09-06-02-06-32-image.png)
