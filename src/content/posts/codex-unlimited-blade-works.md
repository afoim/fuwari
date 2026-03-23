---
title: Codex！无限剑制！
published: 2026-03-06T13:48:05
description: 多的不说，仅做记录
image: ../assets/images/codex.png
draft: false
lang: ""
ai_level: 1
---
# 原理

```mermaid
flowchart TD
    A["通过“魔法”获得大量 OAuth Token"]

    subgraph CPA
        B["批量导入 OAuth Token 到 CPA"]
        C["CPA 创建虚拟 API 端点"]
        D["生成 API Key"]
        E["获得 OpenAI 兼容 API"]

        B --> C --> D --> E
    end

    F["接入 Claude Code / Codex"]

    A --> B
    E --> F
```

# 实操

首先，获得“魔法”，获得大量 OAuth Token

![](../assets/images/codex-unlimited-blade-works.png)

安装 [router-for-me/CLIProxyAPI: Wrap Gemini CLI, Antigravity, ChatGPT Codex, Claude Code, Qwen Code, iFlow as an OpenAI/Gemini/Claude/Codex compatible API service, allowing you to enjoy the free Gemini 2.5 Pro, GPT 5, Claude, Qwen model through API](https://github.com/router-for-me/CLIProxyAPI)。前往 `/management.html` 

上传认证文件

![](../assets/images/codex-unlimited-blade-works-1.png)

添加 API Key

![](../assets/images/codex-unlimited-blade-works-2.png)

查看可用模型

![](../assets/images/codex-unlimited-blade-works-4.png)

导入 Claude Code

![](../assets/images/codex-unlimited-blade-works-3.png)

用

![](../assets/images/codex-unlimited-blade-works-5.png)