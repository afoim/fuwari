---
title: 想要一个Cookie管理器？无需手搓！
published: 2026-01-30T20:27:05
description: Cookie Consent是一个开源简单实现的Cookie管理器，能让您的网站GDPR合规，仅需复制粘贴！
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent.png
draft: false
lang: ""
---
# 前言
你的网站是否有很多的跟踪器？如 **Google Analytics、Google Adsense、Microsoft Clarity、百度统计** 等等？

他们有些是追踪用户体验，获取站点访问数据，有些是提供广告，为您提供收入...

但是，用户是有权限拒绝某些东西的，如拒绝将访问信息传送给Google，或让展示的广告与个性化无关等等

那么我们要如何实现让用户控制自己的数据被传送向何方呢？

你可能会想到，我们可以先编写一个入口脚本，管理这些JS，让用户同意某些再执行JS，又或是和Service Worker约定拦截某些请求

这对于架构设计来说肯定是极好的，但是我们真的有必要手搓一个Cookie管理器吗，为何不去使用一个现成的解决方案呢？

[Download Cookie Consent Banner: GDPR + ePrivacy Directive](https://www.cookieconsent.com/) 它就是一个很好的选择，在该网站上提供你需要被管理的JS脚本片段，然后将该网站返回的JS脚本插入您的站点即可！无需编写额外的JS代码，无需管理复杂的Service Worker约定！这一切也都是通过该网站的客户端JavaScript实现的！

# 正式开始

首先，我们进入 [Download Cookie Consent Banner: GDPR + ePrivacy Directive](https://www.cookieconsent.com/) （搭配浏览器翻译），往下滚动，找到步骤图

第一步，首先选择基本逻辑

- 电子隐私指令：当用户未进行Cookie管理时，这往往是用户第一次进入你的网站，允许所有受管理的JavaScript脚本执行
- GDPR + 电子隐私指令：字面意思，用户不允许就永远不加载

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-1.png)

第二步，设置网站名称，布局样式以及提供您的隐私政策页面

首先填写网站名称，这会在用户管理Cookie时显示

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-3.png)

接下来选择布局，你可以在网站中看到实时更改与实际交互样式，这里不再赘述

然后，选择色彩搭配，这里是硬编码的，但是更建议后续通过JS动态更改自动适配白天/黑夜模式

默认语言用英语即可，该管理器提供了多达 **36 种** 语言，但就是没有简体中文，不过在实际的管理器中有繁体中文。不过英语仍然是一个较好的选择，它易读也是使用率最高的语言，这没什么问题

最终，对于隐私政策，这是个可选项，但是强烈建议配置。不过如果您暂时没有配置，也不用着急，先预填写一个将来的隐私政策URL（http/https开头），后续我会说明为什么这几乎是一个必填项

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-2.png)

第三步，导入您的JS

Ok，终于到重头戏了，接下来，我们需要将我们网站上原来安装的各种追踪器（JS片段），归类然后一个个按部就班的添加进Cookie管理器

这里的名称仅会在最终代码中展示出来，站点访客仅能管理这四种类型是开是关（这也是为什么上文说你几乎配置一个隐私政策页面，否则用户根本不知道这四种类型分别对应着什么），其中，第一个类型是必开的，所以你可以在其中放入一些不运行这些JS网站就不正常的脚本（如评论区）

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-4.png)

第四步，复制网站提供的JS，将其粘贴到您网站的 `<body>` 后。并移除重复的JS片段

值得注意的一点是，当用户在第一屏选择完要启用的Cookie后，日后想更改这些首选项，需要怎么做呢？

网站在提供的代码最后添加了一个特殊标签的按钮，也就是 `id="open_preferences_center"` ，你可以先将红框中的代码移除，否则可能会破坏布局，接下来找一个地方放置这个 **编辑您的Cookie首选项** 按钮，让用户可以轻松的更改Cookie首选项，而不是需要用户伪造一个按钮来手动触发这个id

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-5.png)

# 最终效果

当用户第一次访问时，会弹出是否允许Cookie的弹窗。用户可以选择全部允许（I agree），全部拒绝（I decline）或高级配置（Change my preferences）

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-6.png)

当用户选择高级配置（Change my preferences），会弹出一个窗口，用户首先可以看到一段文本，该文本告知了用户Cookie是什么，为什么需要，以及Cookie如何改善访问体验

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-7.png)

接下来，用户可以单独对这四个区块设置是否允许，每一个区块也会直接但笼统的告诉用户这部分区块的Cookie能做什么。如前文所述，第一个区块是始终开启的

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-8.png)

最终的更多信息（More Information）区块放置了我们最开始填写的隐私政策链接，用户可以方便的跳转到隐私政策页面（前提是你写了），来直观了解您的网站的隐私政策

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-9.png)

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/cookie-consent-10.png)