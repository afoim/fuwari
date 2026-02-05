---
title: WTF？！直接将Umami部署到EdgeOne Pages？扔掉VPS！直接跑在云函数！
published: 2026-01-19T10:14:32
description: 我们都知道，EdgeOne Pages有个完整的Node.js环境，那Umami是Next.js也基于Node.js，那我们是不是可以...
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eo-umami-1.png
draft: false
lang: ""
---
# 原理探寻
由于 **Umami** 使用的是 **SSR** ，我原以为EdgeOne Pages不支持该模式，尝试部署后发现最大的问题在于
```
Error: SSR functions package size exceeds 128MiB limit (157MiB)
```

也就是说，EdgeOne Page是支持SSR程序的，只是Umami构建后的函数太大了，那么我们的思路就很清晰了，只需要裁切一些代码即可

那么该项目就应运而生了 [afoim/umami: Umami is a modern, privacy-focused analytics platform. An open-source alternative to Google Analytics, Mixpanel and Amplitude.](https://github.com/afoim/umami) 

我将Umami v3中的无关紧要的东西，如 `像素统计` `链接统计` `团队` `地理位置文件` 删去了，最终可以在EO上部署一个残血版的Umami

至于数据库，我用的是 https://supabase.com/ 需要注意，连接方式不能用 `Direct Connection`
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eo-umami-2.png)

Demo： [Umami](https://eo-umami.acofork.com/share/rC995W8J6CT4uLDo)

视频： https://www.bilibili.com/video/BV1JiqSBaEY1/

唯一的缺陷，无法获取用户地区（原逻辑有个高达60M的本地Geo文件）
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/eo-umami.png)

# 上手部署

1. Fork 该仓库 [[afoim/umami: Umami is a modern, privacy-focused analytics platform. An open-source alternative to Google Analytics, Mixpanel and Amplitude.](https://github.com/afoim/umami)](https://github.com/afoim/umami-edgeonepages/tree/main)
2. 连接到EdgeOne Pages，但先别点部署
3. 填写环境变量 `DATABASE_URL` 从Supbase中拿，类似于 `postgresql://postgres.kupggtyqiaepzvjqbboy:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`
4. 绑定你的域名，访问并登录。用户名： admin | 密码：umami
# 疑难解答
~~内部重定向貌似出了问题，如果你想要访问设置更改你的管理员密码请手动前往 `/settings/preferences`~~ 他们解决了这个问题，但是...

但是有个新问题，就是POST请求全被吃了，目前代码暂时将所有POST请求改为了GET请求。我们在 **Main** 分支发布了全GET请求的版本，保证普通用户可用

**master 分支目前提供给腾讯当作试验场使用，会暴露很多敏感信息，别用**