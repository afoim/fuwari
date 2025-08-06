---
title: QQ微信不够私密？自建自己的聊天服务器！
published: 2025-08-02
description: '通过自建Synapse，用户可以通过Element等软件来直接在你的服务器上聊天'
image: '../assets/images/2025-08-02-17-20-32-image.png'
tags: [Matrix, Synapse]
category: '教程'
draft: false 
lang: ''
---

# 前置环境准备

由于Synapse、Matrix（下文简称”矩阵“）手搓部署非常麻烦。所以请安装 **1Panel面板**

# 部署PostgreSQL

安装并创建名为 `synapse` 用户名也为 `synapse` 的数据库

前往应用商店安装 `PGAdmin4`

![](../assets/images/2025-08-02-17-24-58-image.png)

接着点击添加服务器

![](../assets/images/2025-08-02-17-27-10-image.png)

相关信息可以在连接信息看到

![](../assets/images/2025-08-02-17-27-53-image.png)

**删除**刚刚创建的 `synapse` 这个数据库

![](../assets/images/2025-08-02-17-28-49-image.png)

重新创建同名数据库

设置所有者（即用户名）为 `synapse` 

![](../assets/images/2025-08-02-17-29-36-image.png)

将 `排序规则` 和 `字符类型` 都改为 `C`

![](../assets/images/2025-08-02-17-30-34-image.png)

# 部署Synapse

首先参照1Panel官方的教程去创建一个存储卷，否则安装 `synapse` 会失败

![](../assets/images/2025-08-02-17-32-00-image.png)

安装 `synapse` 

导航到文件管理： `/var/lib/docker/volumes/synapse-data/_data`

你应该可以看到

![](../assets/images/2025-08-02-17-33-50-image.png)

编辑 `homeserver.yaml` ，并按需配置

```yaml
server_name: "家服务器名称，比如：m.2x.nz"
public_baseurl: "公共URL，比如：https://m.2x.nz"
pid_file: /data/homeserver.pid

serve_server_wellknown: true # 启用联邦

listeners:
  - port: 8008
    tls: false
    type: http
    x_forwarded: true
    resources:
      - names: [client, federation]
        compress: false
    response_headers:
      Access-Control-Allow-Origin: "https://app.element.io"
      Access-Control-Allow-Methods: "GET, POST, OPTIONS"
      Access-Control-Allow-Headers: "Content-Type, Authorization"

database:
  name: psycopg2
  args:
    user: synapse
    password: 你的数据库密码
    dbname: synapse
    host: 你的PostgreSQL的容器名称
    cp_min: 5
    cp_max: 10

log_config: "/data/my.matrix.host.log.config"
media_store_path: /data/media_store

registration_shared_secret: "这里的东西是随机生成的，每个人都不一样，请忽略这一块，并使用你的配置"
macaroon_secret_key: "这里的东西是随机生成的，每个人都不一样，请忽略这一块，并使用你的配置"
form_secret: "这里的东西是随机生成的，每个人都不一样，请忽略这一块，并使用你的配置"
signing_key_path: "/data/my.matrix.host.signing.key"

report_stats: false

trusted_key_servers:
  - server_name: "matrix.org"

# Github OAuth
oidc_providers:
  - idp_id: github
    idp_name: Github
    idp_brand: "github"  # optional: styling hint for clients
    discover: false
    issuer: "https://github.com/"
    client_id: "Ov23liaHxxYHybb0jRoZ" # TO BE FILLED
    client_secret: "e937f214ea7c132924ab34c76d83f4b7099d696e" # TO BE FILLED
    authorization_endpoint: "https://github.com/login/oauth/authorize"
    token_endpoint: "https://github.com/login/oauth/access_token"
    userinfo_endpoint: "https://api.github.com/user"
    scopes: ["read:user"]
    user_mapping_provider:
      config:
        subject_claim: "id"
        localpart_template: "{{ user.login }}"
        display_name_template: "{{ user.name }}"

### ✅ 邮件配置（确保SMTP验证正常）
email:
  smtp_host: "你的SMTP发件服务器"
  smtp_port: 465
  smtp_user: "你的发件邮箱"
  smtp_pass: "你的SMTP密码"
  force_tls: true
  notif_from: "Matrix <你的发件邮箱>"
  validation_token_lifetime: "5m"

### ✅ 启用注册 + 邮箱验证 + 密码找回
enable_registration: true
registrations_require_3pid:
  - email
registration_requires_token: false   # 确保不强制邀请码注册（默认关闭）
password_config:
  enabled: true

### ✅ 允许邮箱登录
login_via_existing_session:
  enabled: true

rc_registration:
  per_second: 0.003  # 每秒允许的注册请求（例如：0.003 ≈ 每5分钟一次）
  burst_count: 1     # 同一IP地址的最大注册突发数

  # 消息发送速率限制
rc_message:
  per_second: 0.2    # 每秒允许发送的消息数
  burst_count: 10    # 突发消息缓冲区大小

# 房间加入速率限制
rc_joins:
  local:
    per_second: 0.1   # 本地用户加入房间的速率
    burst_count: 10
  remote:
    per_second: 0.01  # 远程用户加入房间的速率
    burst_count: 10

# 媒体保留设置
media_retention:
  # 本地媒体文件的保留时间
  local_media_lifetime: 90d
  
  # 远程媒体文件的保留时间（来自其他homeserver的媒体）
  remote_media_lifetime: 14d

# 删除陈旧设备的时间
delete_stale_devices_after: 1y

auto_join_rooms:
  - "#XXX:你的家服务器URL" # 需要自动加入的房间
```

按需配置，更多高级配置参阅： [Homeserver Sample Config File - Synapse](https://element-hq.github.io/synapse/latest/usage/configuration/homeserver_sample_config.html)

# 创建管理员账号

连接上容器的终端然后输入这串命令创建管理员账号

```bash
register_new_matrix_user  http://localhost:8008 -c /data/homeserver.yaml  -a -u 管理员用户名 -p 密码
```

# 开始聊天

前往 https://app.element.io 将家服务器改为你的（必须为HTTPS）

通过刚刚创建的管理员账号登录

其他人可以通过邮箱注册
