---
title: 上手米哈游AI，然后把它逆了！
published: 2025-12-02T09:11:40
description: AnuNeko是一只会哈气的橘猫...其实不是，AnuNeko是由米哈游创始人做的AI大模型，会哈气。于是便做个QQBot给群友玩
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/anuneko.png
tags:
  - AnuNeko
  - NoneBot2
  - AI
draft: false
lang: ""
---
# 这是What
这是橘猫，会哈气（见封面

你可以前往 [AnuNeko](https://anuneko.com/#/chat) 逗猫

# 逆！
okok，注意到登陆后的请求头中有 `x-token` 字段
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/anuneko-1.png)

手搓个请求发发，`data` 携带内容 
```json
curl --location 'https://anuneko.com/api/v1/msg/会话id/stream' \
--header 'x-token: 账号Token' \
--header 'Content-Type: text/plain' \
--header 'Cookie: 自动拿取' \
--data '{"contents":["test"]}'
```

通了
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/anuneko-2.png)

然后还有一种情况，在遇到Pick的时候，我们要发送要选择的回复编号
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/anuneko-3.png)

发个如图请求帮橘猫选择
```
curl --location 'https://anuneko.com/api/v1/msg/select-choice' \
--header 'x-token: 你的Token' \
--header 'Content-Type: text/plain' \
--header 'Cookie: 自动拿取' \
--data '{"msg_id":"会话id","choice_idx":0或1}'
```

还有还有，这有个橘猫和黑猫，如何切换一个会话的猫？
```
curl --location 'https://anuneko.com/api/v1/user/select_model' \
--header 'x-token: 你的Token' \
--header 'Content-Type: text/plain' \
--header 'Cookie: 自动拿取' \
--data '{"chat_id":"会话id","model":"Exotic Shorthair或Orange Cat"}'
```

随便写了个适用于NoneBot2的插件，玩吧
[AnuNeko_NoneBot2_Plugins/anuneko.py at main · afoim/AnuNeko_NoneBot2_Plugins](https://github.com/afoim/AnuNeko_NoneBot2_Plugins/blob/main/anuneko.py)