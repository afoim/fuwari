---
title: 出门在外，如何优雅、高效、流畅地远程自家电脑？
published: 2025-11-24T18:04:57
description: 当今，我们出门在外，几乎哪哪都能摸到电脑，但是我们大部分的工作文件一般都在自家电脑，为了保持工作流的一致，我们自然就有了远控自家电脑的需求了
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/9207_112_29_106_130_rx7fsq.png
tags:
  - 远程
  - STUN
  - RDP
draft: false
lang: ""
---
# 前言
你可能觉得，这人不是XX吗，远控当然下载个类似UU远程、向日葵这种软件不就行了，这还要出一篇文章？

那我问你，如果你用的电脑是32位而不是64位，当你用的公司网络NAT类型并不开放又或者没有IPv6？我们要如何优雅、高效、流畅的使用远程呢？

# 正式开始
我们分两步走，一个是针对于64位的电脑，较简单，而另一个是针对于32位的电脑，稍微复杂

### 64位
首先，将家里的路由器的 **UPnP** 功能打开，然后直接下载 [网易UU远程官网_真4K、真免费、真好用](https://uuyc.163.com/) ，登录账号直接连接，绝大部分情况都是P2P（点对点连接，即控制和被控端直接连接）

### 32位
由于UU远程仅支持64位的电脑，我们就要想点花招了

我用的办法比较极客，就是将家里设备的 **RDP** 端口打到公网上来，也就是利用 **STUN** ，但是这种方法要求家庭网络的NAT类型为1（Full Cone）

那么首先，我将家中的路由器的 **DMZ** 主机设置为家里电脑的IP
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/remote.png)

DMZ启用后，所有打到路由器上所有端口（除路由器自身占用端口）的流量全部转发给DMZ主机

用人话来说，你访问路由器的3389端口就能直接访问到电脑的3389端口

这样设置之后，你就可以使用 **STUN** 协议，将路由器的3389端口转发到ISP给你分配的公网上

用人话来说，STUN后，访问你正在用的 `公网IP:随机端口` ，就能访问到路由器的3389端口，又因为配置了DMZ，就又能访问到电脑的3389端口

那么如何简单的开一个 **STUN隧道** 呢？

我这里使用的是 [MikeWang000000/Natter: Expose your TCP/UDP port behind full-cone NAT to the Internet.](https://github.com/MikeWang000000/Natter) ，它是一个Python编写的程序，确保你的网络为NAT1后，你可以使用一个简单的命令，如： `python natter.py -p 3389` 来创建STUN隧道
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/remote-1.png)

观察 `WAN > 112.32.39.77:55265    [ OPEN ]` 证明你已经可以通过该 `公网IP:端口` 来在世界各地，只要连上了 **互联网** ，就能连上家里的电脑

最后，`Win+R` 调出运行，输入 `mstsc` 打开远程控制的窗口，开始你的远程之旅吧

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/9207_1_112_29_106_130_gdqwd8.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/9207_112_29_106_130_rx7fsq.png)
