---
title: 手把手教你克隆音色！
published: 2025-10-13T12:19:06
description: 仅需几秒的语音就能克隆音色，无需繁琐配置，一键启动！随时随地做蓝底神人小视频！
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/index-tts2-4.png
tags:
  - AI
  - 音色克隆
draft: false
lang: ""
---
# 正式开始

> 视频教程： https://www.bilibili.com/video/BV1qv41zgEjE/

> 请全程魔法

安装Git Lfs： `git lfs install`

克隆仓库： [index-tts/index-tts: An Industrial-Level Controllable and Efficient Zero-Shot Text-To-Speech System](https://github.com/index-tts/index-tts)

拉取Git Lfs文件： `git lfs pull`

安装UV（Python包管理器，类似pip）： `pip install -U uv`

安装依赖： `uv sync --extra webui`

安装hf-cli： `uv tool install "huggingface-hub[cli,hf_xet]"`

从hf下载模型： `hf download IndexTeam/IndexTTS-2 --local-dir=checkpoints`

运行web UI： `uv run webui.py`

浏览器打开 `7860` 端口

# 简单使用

WebUI页面长这样
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/index-tts2-1.png)

首先将音色参考音频输入（几秒即可）

然后输入要朗读的文本

最终点击生成

# 调教

推荐使用 **使用情感向量控制** 

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/index-tts2-2.png)