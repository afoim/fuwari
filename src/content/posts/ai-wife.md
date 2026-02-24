---
title: 手把手教你跑一个二次元AI老婆！
published: 2026-02-12T18:20:25
description: 极！其！简！单！傻！子！都！会！本期将手把手教你从软件安装，到模型配置再到出图，百分百画出惊艳的图片！
image: ../assets/images/ai-wife-15.png
tags: [AI绘图, NoobAI]
category: '教程'
draft: false
lang: ""
---
# 引言

曾经我写过一篇文章，记录了从零开始研究AI绘图的经历——当时把Stable Diffusion WebUI、Stable Diffusion Forge WebUI、ComfyUI全装了一遍，各种找教程、实操、试错。好在凭借着仅剩的记忆也是顺着这些蛛丝马迹把丢掉的知识找回来了。

但那篇文章从现在看来，配置还是太麻烦了，并且有很多深层的东西没有讲清楚，只是教授了如何画 Danbooru 里已收录的角色。那么如果我想要画的角色很新或者没有收录呢？这期带你吃透AI绘图！

在纯小白的情况下，你可以跑出类似下面的图！（跑不出来你打死我！）

![2025-05-13-11-59-50-ComfyUI_00016_.webp](../assets/images/2025-05-13-11-59-50-ComfyUI_00016_.webp)

![2025-05-13-12-00-37-ComfyUI_00011_.webp](../assets/images/2025-05-13-12-00-37-ComfyUI_00011_.webp)

# 简单的思维风暴

在正式开始前，我们将会用到以下术语，这里会简单介绍都是做什么的：

- **ComfyUI**：一个软件，是AI绘图控制台，你只需要在这里点点即可出图
- **checkpoint**：一个底层的，作为基底的模型。可以直接用它开始绘图又或者搭配下面的Lora模型来绘图
- **LoRA**：一个控制角色/风格的模型。可以通过载入不同的LoRA去画出不同的角色或风格
- **prompt**：提示词，用以告知AI你想要画出什么样的东西

简单来说，这一切并不复杂，我们只需要首先挑选一个基底模型，如果你不挑或者你想画的角色正好就在其中，可以直接使用该角色的提示词作画。如果你想画不在其中的角色，只需要再载入一个LoRA模型即可。

# 正式开始

## 下载ComfyUI

> [!tip]
> 更推荐使用 [Stable Diffusion Forge](https://www.bilibili.com/video/BV1rc6nYNEYo/)，如果不需要复杂的节点配布，sdf可以更方便的去写提示词
> ![](../assets/images/ai-wife-17.png)

> 尽管ComfyUI支持AMD显卡以及纯CPU绘图，但还是建议使用 **NVIDIA Cuda** 进行绘图，更快，兼容性也更好！ 

### 方式一：官方版（推荐）

前往 [ComfyUI | 用AI生成视频、图像、音频](https://www.comfy.org/zh-cn/) 下载并安装，记得打开魔法或在设置中更改镜像源

![](../assets/images/ai-wife.png)

### 方式二：秋叶整合包

前往秋叶的视频评论区下载ComfyUI整合包，下载并解压： https://www.bilibili.com/video/BV1Ew411776J

解压完后打开文件夹，打开 `A绘世启动器`

![2025-05-13-12-05-17-image.webp](../assets/images/2025-05-13-12-05-17-image.webp)

点击右下角的开始运行，先让他进行初始化，直到它自动打开你的浏览器并且可以正常进入ComfyUI的界面

![2025-05-13-12-06-57-image.webp](../assets/images/2025-05-13-12-06-57-image.webp)

## 下载基底模型

大部分LoRA一般都需要这两个基底模型。其中 NoobAI 支持直接通过 Danbooru 里已有的角色直接作画，无需其他LoRA：

- [NoobAI-XL (NAI-XL) - V-Pred-1.0-Version | NoobAI Checkpoint | Civitai](https://civitai.com/models/833294?modelVersionId=1190596)（需魔法）

- [WAI-illustrious-SDXL - v16.0 | Illustrious Checkpoint | Civitai](https://civitai.com/models/827184/wai-illustrious-sdxl)

点击下载即可

![2025-05-13-12-08-17-image.webp](../assets/images/2025-05-13-12-08-17-image.webp)

> [!warning]
> 由于V预测模型（NoobAI-VPred）较新，只能在SDForge和ComfyUI上运行，原版SD无法运行，会崩图！

### 如果你需要下载LoRA

首先你要知道你想画的角色的英文名，如 **Cartethyia** （鸣潮 - 卡提希娅） 

然后前往 https://civitai.com/ 进行搜索，选择你喜欢的LoRA

![](../assets/images/ai-wife-1.png)

在详情页你可以看到该LoRA所需要的基底模型。有些时候模型的简介也会写

下面的 **Trigger Words** 是推荐的 **正向提示词** 一般来说仅导入LoRA不写专有提示词也会有一定的效果

![](../assets/images/ai-wife-2.png)

## 放置模型

> [!warning]
> 这里有一个坑点，对于桌面版安装的ComfyUI，请将模型放到你当时安装时选择的文件夹中，如： `C:\Users\af\Documents\ComfyUI` ，而不是形如 `C:\Users\af\AppData\Local\Programs\ComfyUI\resources\ComfyUI` 的地方，更多请参见官方文档： [重要提示：请勿修改 resource/ComfyUI 文件夹 - Windows桌面版 - ComfyUI](https://docs.comfy.org/zh-CN/installation/desktop/windows#%E9%87%8D%E8%A6%81%E6%8F%90%E7%A4%BA%EF%BC%9A%E8%AF%B7%E5%8B%BF%E4%BF%AE%E6%94%B9-resource/comfyui-%E6%96%87%E4%BB%B6%E5%A4%B9)

打开 `models` 目录：
- 将基底模型（类似 `noobaiXLNAIXL_vPred10Version.safetensors`）放入 `checkpoints` 文件夹
- 将LoRA模型放入 `loras` 文件夹

![2025-05-13-12-10-06-image.webp](../assets/images/2025-05-13-12-10-06-image.webp)

## 启动！开始画！

启动 ComfyUI

默认打开应该是空空如也，这边提供了一个起手式+LoRA的工作流，你可以直接导入：

[点我下载- 基础起手.json](https://2x.nz/files/基础起手.json)

[点我下载- 基础起手+Lora.json](https://2x.nz/files/基础起手+Lora.json)

下载之后，点击左上角的ComfyUI图标，打开这个工作流

![](../assets/images/ai-wife-3.png)

接下来，你应该已经有了这些节点

![](../assets/images/ai-wife-4.png)

### 加载模型

这里加载基底模型，刷新ComfyUI后你应该可以在 `Checkpoint加载器(简易)` 处看到你放置的所有模型，选择带有 `vPred...` 的就是V预测模型

![2025-05-13-12-11-55-image.webp](../assets/images/2025-05-13-12-11-55-image.webp)

![](../assets/images/ai-wife-5.png)

这里加载LoRA（如果有）

![](../assets/images/ai-wife-6.png)

### 填写提示词

这里填写正/反向提示词，均为 **英文** ，如果不会写就去找其他AI描述你要画什么，然后让它返回给你用以AI绘图的prompt

![](../assets/images/ai-wife-7.png)

#### 如何找到角色的提示词？

**方式一：使用Danbooru角色标签（NoobAI专属）**

NoobAI模型的一大特色就是支持直接通过Danbooru里已有的角色直接作画！你想要画什么呢？比如崩铁的流萤？

进入 [Danbooru characters in NoobAI-XL (NAI-XL)](https://www.downloadmost.com/NoobAI-XL/danbooru-character/)

搜索流萤的英文名 `firefly` 或者搜索 `star rail` 找到所有关于崩铁的角色

![2025-05-13-12-15-16-image.webp](../assets/images/2025-05-13-12-15-16-image.webp)

复制 `Prompt tags`，然后将其粘贴进链接了正面条件的CLIP文本编码器

![2025-05-13-12-16-35-image.webp](../assets/images/2025-05-13-12-16-35-image.webp)

这样角色预设就写好了！

**方式二：使用LoRA的Trigger Words**

如果你使用LoRA，直接复制详情页的Trigger Words即可。

#### 起手提示词推荐

我这里也提供了一些起手的提示词：

- **正面条件**：
  ```
  masterpiece, best quality, newest, absurdres, highres
  ```

- **负面条件**：
  ```
  text, watermark, worst quality, old, early, low quality, lowres, signature, username, logo, bad hands, mutated hands, mammal, anthro, furry, ambiguous form, feral, semi-anthro
  ```

我们将其添加到ComfyUI，如下图：

![2025-05-13-12-19-32-image.webp](../assets/images/2025-05-13-12-19-32-image.webp)

> [!tip]
> 如果你想要图片是不同的样子请在正面提示词和反面提示词添加（**必须为英文！不知道的用翻译或者问AI！**）。比如想要让足部放到焦点上并且裸足就添加**正面提示词**：`barefoot, feet in foreground`

### 设置图像尺寸

这里设置生成图片的分辨率，根据不同模型有不同的推荐分辨率：

**NoobAI推荐分辨率**（总面积约为 1024x1024）：
- **最推荐：832x1216**
- 其余：768x1344、896x1152、1024x1024、1152x896、1216x832、1344x768、1024x1536、1536x1024

![2025-05-13-12-22-06-image.webp](../assets/images/2025-05-13-12-22-06-image.webp)

![](../assets/images/ai-wife-8.png)

> 建议前往模型发布页查看相关推荐分辨率信息

### 配置K采样器

这里控制生成参数（默认给你的就是一个不错的选择，如果不懂就不要动）

![](../assets/images/ai-wife-9.png)

- **种子**：每次都是一个随机值，如果固定下来且其他内容无变化则会始终出相同的图
- **步数**：即AI需要重绘多少次，过低会导致鬼图、崩图，过高可能会导致元素冗杂、饱和度过高
  - NoobAI推荐：28-35
- **CFG**：AI对你输入的提示词的服从度，越高则越服从，越低则画得越天马行空（忽略一些提示词）
  - NoobAI推荐：4-5
  - 其他模型建议：7-9
- **采样器名称**：采样方式
  - NoobAI：**只能用euler**（❗重要！不能更改！可能会崩图！）
  - 其他模型：大部分都能出正常图
- **降噪**：AI生图的原理是将一张看起来像纯色图的图片一次次进行降噪来得到最终产物，该值设置得越低，则图片越不清楚、混杂，越高则越清晰，但更会出现过度锐利或过度解析

### 开启实时预览

为了确保在生图的时候我们不无聊，可以前往设置开启实时预览功能，将 **实时预览** 改为 **自动** 即可

![](../assets/images/ai-wife-16.png)

### 运行生成

接下来点击右上角的运行，哦对了，你还可以编辑旁边的数字来一次性生成多张图片

![](../assets/images/ai-wife-10.png)

由于我们开启了实时预览，你可以看到模型每一步的绘画进度

![](../assets/images/ComfyUI_UkQQZG4KkW.gif)

点击右上角的资产，可以展开，查看大图

![](../assets/images/ai-wife-11.png)

所有生成的图片都可以在 `output` 文件夹看到

![](../assets/images/ai-wife-12.png)

如果你想画其他角色也只需要：**找LoRA，写推荐提示词，开跑！**

![](../assets/images/ai-wife-13.png)

![](../assets/images/ai-wife-14.png)

# 常见问题与技巧

- **AI生成的图片随机性较强**：每一次生成的图片都不太一样，多试试！

- **避免生成涩图**：可以在负面提示词添加 `NSFW`，在正面提示词添加 `safe`

- **关于V预测模型**：由于V预测模型较新，只能在SDForge和ComfyUI上运行，原版SD无法运行，会崩图

- **参考资源**：更多NoobAI模型的技巧可以到Civitai模型页面的About查看
  ![2025-05-13-12-30-55-image.webp](../assets/images/2025-05-13-12-30-55-image.webp)
