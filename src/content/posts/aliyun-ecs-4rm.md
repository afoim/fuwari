---
title: 什么？4元每月200G的服务器？还是阿里的？还有联通9929精品回程？？
published: 2026-01-16T23:59:40
description: 通过创建抢占型实例+每月免费CDT 200G流量包，你几乎只需要付很少的硬盘费！
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm.png
draft: false
lang: ""
---
# 正式开始
> [!CAUTION]
> 抢占型实例在高峰期可能会进行回收，不要跑生产业务

> [!NOTE]
> 下文都是以 **阿里云国内版** 演示的，注意在国内版按量付费业务需要账户内可用余额要 >=100 CNY。国际版无限制，但是要海外手机号+海外卡，有可能还需要KYC
### 下载Alpine镜像
>由于我们主要的成本在硬盘上面，所以呢为了极致压缩空间，我们需要一个非常小巧的Linux镜像，以便我们可以用1G的 ESSD 云盘来安装。如果你也是极致玩家，仅用1G盘装系统，那么一定就要用我下面给你的Alpine镜像
>如果你财大气粗，不在乎，或者说想跑一些正常业务，想用Debian或Ubuntu，那就10G起步，也不需要自定义镜像了

Alpine 60M镜像链接
```bash
https://dl-cdn.alpinelinux.org/alpine/v3.23/releases/x86_64/alpine-virt-3.23.2-x86_64.iso
```

### 将镜像上传至阿里云OSS
> 由于我们需要自定义镜像，但是镜像又必须要通过OSS提供，所以我们需要临时性的创建一个OSS Bucket实例，来上传我们的ISO镜像。在实例成功创建后，我们可以将其删除，以避免不必要的扣费

首先，来到 [OSS管理控制台](https://oss.console.aliyun.com/bucket) ，创建一个 Bucket，**地域一定要选中国香港** ，并且上传ISO，最后，复制URL备用

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-1.png)

### 导入镜像
前往 [云服务器管理控制台](https://ecs.console.aliyun.com/image/region/cn-hongkong) ，选择右上角的 导入镜像
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-2.png)

注意需要授权ECS访问OSS业务
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-3.png)

然后正常填写，**取消勾选“导入后执行检测”** ，先不要点下一步

![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-4.png)

接下来勾选配置云盘属性，并且将 **云盘容量设置为1GB** ，确认无误，导入
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-5.png)

### 创建ECS抢占型实例
前往 [云服务器管理控制台](https://ecs.console.aliyun.com/server/) ，创建 **中国香港** 实例，注意红框区域要保持一致

另外，对于 **网络及可用区** ，香港一共有 **B、C、D** 三个区，D区比B、C区贵不少，可以都开开测个速，留下最好的
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/ALIECSSNPSHOT.png)

### 开通CDT
前往 [云数据传输](https://cdt.console.aliyun.com/overview) 将升级状态全部变为已升级即可
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-6.png)

### 创建&绑定弹性公网IP并且挂上CDT
> 因为弹性公网IP可以绑定CDT的每月200G免费流量，并且在绑定实例后，弹性公网IP将不会再扣费。如果后续删机的时候不要忘记释放弹性公网IP，否则会一直扣费

进入 [专有网络管理控制台](https://vpc.console.aliyun.com/eip/cn-hongkong/eips) 如图选择，然后购买即可（这里显示的费用是纯持有不绑定的费用，一旦绑定就不计费了）
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-7.png)



接下来绑定弹性公网IP（因为我绑定过了，所以是解绑）
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-8.png)

接下来在这里绑定CDT，带宽最高可以拉到 2000Mbps，但是不推荐，一般300M够用了
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-9.png)

### 配置Alpine
> 如果你安装了Alpine，默认是需要VNC进入手动配置系统的。如果是公共镜像，则已经可以用了，但不要忘了保证系统纯净

进入 [云服务器管理控制台](https://ecs.console.aliyun.com/server/) 选择你刚买的ECS，接下来点击 **远程连接** ，展开更多，选择 **通过VNC远程连接**

接下来就是愉快的敲命令环节~ （方括号内为默认值，你可以输入新值回车覆盖也可以直接回车应用默认值）

- 启动 Alpine 安装程序

```sql
localhost:~# setup-alpine
```

- 选择键盘布局

```sql
Select keyboard layout: [none] us
Select variant: [us]
```

- 设置主机名

```sql
Enter system hostname (fully qualified form, e.g. 'foo.example.org') [localhost] alpine-vps
```

- 设置网卡

```sql
Available interfaces are: eth0 lo
Which one do you want to initialize? [eth0]
```

- 设置 IP 获取方式

```sql
Ip address for eth0? (or 'dhcp', 'none', 'manual') [dhcp]
```

- 是否进行手动网络配置

```sql
Do you want to do any manual network configuration? [no]
```

- 设置 root 密码（输入时不会显示）

```sql
New password:
Retype password:
```

- 设置时区，或者（PRC）

```sql
Which timezone are you in? ('?' for list) [UTC] Asia/Shanghai
```

- 设置代理

```sql
HTTP/FTP proxy URL? [none]
```

- 选择软件仓库镜像。这个地方建议先输入 `s` 列出所有镜像，然后上下翻找找到阿里云镜像源，然后输入对应镜像源编号，否则选错了你后续通过apk安装软件的时候不会免流
 
```sql
Which mirror do you want to use? (or '?' or 'done') [44] 
```

- 不创建普通用户

```sql
Setup a user? (enter a username, or 'no') [no] no
```

- 选择 SSH 服务

```sql
Which SSH server? ('openssh', 'dropbear', or 'none') [openssh]
```

- 是否允许 root 通过 SSH 登录

```sql
Allow root ssh login? ('?' for help) [prohibit-password] yes
```

- 没有找到磁盘，是否安装至 vda 云盘，是
```sql
No disk available, Try boot media /media/vda ? (y/n) [n] y
```

- 选择要安装的磁盘

```sql
Which disk(s) would you like to use? (or '?' for help or 'none') [none] vda
```

- 选择磁盘使用方式

```sql
How would you like to use it? ('sys', 'data', 'crypt', 'lvm') [sys]
```

- 确认格式化磁盘

```sql
WARNING: Erase the above disk(s) and continue? [y/N] y
```

- 安装系统

```sql
Installing system on /dev/sda:
  Installing alpine-base...
  Installing busybox...
  Installing openssh...
  Installing openrc...
```

- 安装完成提示

```sql
Installation is complete. Please reboot.
```

- 重启系统

```sql
localhost:~# reboot
```

- 重启后登录

```sql
alpine-vps login: root
Password:
```

- 设置DNS（Cloudflare & Google DNS）

```sql
alpine-vps:~# setup-dns
DNS Domain name? (e.g. 'bar.com') nameserver
DNS nameserver(s)? [223.5.5.5] 1.1.1.1 8.8.8.8
```

Alpine的软件包管理器为 **APK** ，首先我们先更新软件源
```sql
apk update
```
接下来，安装一些基本的软件包
```sql
apk add curl unzip jq openssl tar iproute2 bash
```
### 设置保活&用量封顶策略
虽然我们将弹性公网IP连接了CDT，默认流量会从CDT的免费流量份额里面扣

但是一旦超出上限，那就会扣我们的真金白银了

所以，我们需要一个定时监测的服务，发现CDT流量快用完了立即停机

那么...让我们请出 Cloudflare Worker！

::github{repo="afoim/cf-worker-aliyun-cdt-tracker"}

在Cloudflare Worker的仪表盘配置五个机密环境变量即可
以下是需要配置的机密环境变量 (Secrets)：

| 变量名                    | 描述                      | 示例 / 备注                    |
| :--------------------- | :---------------------- | :------------------------- |
| `ACCESS_KEY_ID`        | 阿里云账号的 AccessKey ID     | `LTAIxxxxxxxxxxxx`         |
| `ACCESS_KEY_SECRET`    | 阿里云账号的 AccessKey Secret | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `REGION_ID`            | ECS 实例所在的区域 ID。         | cn-hongkong                |
| `ECS_INSTANCE_ID`      | 需要控制的 ECS 实例 ID。在控制台获取  | i-xxxxxxxxxxxx             |
| `TRAFFIC_THRESHOLD_GB` | 流量阈值（单位：GB），超过此值将停止实例   | `180` (默认为 180)            |

我们需要前往 https://ram.console.aliyun.com/profile/access-keys 创建一个RAM用户，你就会得到 `ACCESS_KEY_ID` 和 `ACCESS_KEY_SECRET` ，并且分配权限：`AliyunECSFullAccess`  `AliyunCDTFullAccess

部署成功后，Cloudflare Worker将在每分钟检查一次CDT，如果超出流量阈值，会将指定ID的ECS停止
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/aliyun-ecs-4rm-10.png)

# 计费流程图
带宽费（按固定带宽计费收取）：根据您指定的带宽峰值和计费时长后付费，与实际使用的流量无关。

流量费（按使用流量计费收取）：根据每小时公网的实际流量计费。

最终，抢占型ECS实例每个小时扣费 **0.005528 元** ，按照一个月31天，每月扣费 **4.112832 元** ，而弹性公网IP一经绑定便不再计费，CDT每月免费200G海外流量，不超出不计费，OSS免费存储5G，传入流量不计费，我们也没有传出流量，或者保险起见你也可以将其删除

**最终每月成本：不到5元！**
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/4411ab2fe9dfe7df65472e5b426af5671.png)