---
title: 让我们来看看图片防盗链各大厂做的怎么样！
published: 2026-02-01T16:57:26
description: 今天突发奇想就像试试抓抓各大厂的头像接口，没想到有挺多根本没有防盗链
image: https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/avatar.png
draft: false
lang: ""
---

# 这是什么？
只是随便搜集的一些头像接口，全部来自于我手机里目前安装的大部分APP服务。其中无 **Web** 标识的头像，如果你能看得见，那么证明该服务商并没有做严格的SSL校验，导致逆向极其简单。无该标识的默认为移动APP。以下所有资源均来自我个人使用的账号

# 一些小发现
- 微软（Microsoft）的头像非常严格，使用Cookie校验，不能直接访问
- 微信、支付宝，TapTap，钉钉不采用Web协议，故抓不到包
- 小黑盒，网易云音乐，酷安，作业帮，豆包，肯德基，库街区都采用了严格的SSL校验，不能直接访问
- 下述图片，除了TapTap校验Referer，其他都没有校验Referer，故可以直接访问。不过就算校验Referer也是徒劳

|                                                                    头像                                                                    | 描述  |
| :--: | :-: |
|  <img src="https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0" width="50" height="100"> | QQ  |
| <img src="https://ocs-cn-north1.heytapcs.com/titans-usercenter-avatar-bucket-cn/vf/q7/7c/vfq77cwaxzzwzzaky7rkgiear4000000_1755101257605_s.jpg" width="50" height="100"> |   OPPO（Web）  |
| <img src="https://lh3.googleusercontent.com/a/ACg8ocLIJXR_N2wuwp93PorzuRum2GhcH7J2dO-OZUyDhMbB-AR_wbp6GM2cl7wWM6g2R8wddRd6SCJDWbRFKoenroJnx3eVdHE=s288-c-no" width="50" height="100"> |   Google（Web）  |
| <img src="https://cdn.cnbj1.fds.api.mi-img.com/user-avatar/eUlnezeXgqmLGraD2sQ90d-x-vk-cd104cbc_320.jpg" width="50" height="100"> |   小米（Web）  |
| <img src="http://storage.360buyimg.com/default.image/6a645f6465665f696d675f393836323031373632333134353936313533_big.jpg" width="50" height="100"> |   京东（Web）  |
| <img src="https://aos-cdn-image.amap.com/pp/avatar/bb8/e4/0e/277600933.jpg?ver=1717735051&imgoss=1" width="50" height="100"> |   高德地图（Web）  |
| <img src="http://img.meituan.net/avatar/0c3440bf16903eeba85fe9965bcdc66115409.jpg%40132w_132h_1e_1l.webp" width="50" height="100"> |   美团  |
| <img src="https://img.alicdn.com/sns_logo/TB1e4rMt8Bh1e4jSZFhXXcC9VXa-240-240.png_320x320q95.jpg" width="50" height="100"> |   淘宝  |
| <img src="http://avatar3-3.pddpic.com/a/Q0FvYVZ2SDFGRkJQTFpTMUlTaHRIN1d4MDI3QUNhWWt3UT09djA0-1706852575?imageMogr2/thumbnail/100x" width="50" height="100"> |   拼多多  |
| <img src="https://avatars.githubusercontent.com/u/180811437?s=400&u=e785f90ecf2021cc754f9e705c171389f17a204e&v=4" width="50" height="100"> |   GitHub（Web）  |
| <img src="https://cdn5.telesco.pe/file/eEJesgiw8Vk2I9TP-d0xawWucIlC-204T6Ghy1LGLLmNUuajtFbh5eX1iL3fEao2jnjI92dpXAkyOSOiWIjhNbdWQ7PVKdFKCIUF-FqF8S0O27QcHFxrEMcTH-Ajpe-iX55sjjNvZC6IaHbEXjcVxBvF0fMjNb4BIYzW_KVVVsD0bG1H_rkf89rlPTePCUFySDdtFx7QYegbtoruOUcCuqt00qcozFIMynAi5NLGbtkTfRcUq3nJ2-7g9SGPpPI1U5MQPwjIR_c2p1dTiveR5q-9fx5rMk4IM_pOBRnjNAkJGm7fjNQQzanfgz5QK6kQ8VgPRHC2Ny-0gifoklRY7A.jpg" width="50" height="100"> |   Telegram（Web）  |
| <img src="https://img.qwps.cn/315260194?imageMogr2/thumbnail/180x180!&k=1715912797563685102" width="50" height="100"> |   WPS（Web）  |
| <img src="http://img.alicdn.com/bao/uploaded/i1/O1CN01Y71UwZ1Xr3hlLi79V_!!4611686018427385488-0-mtopupload.jpg" width="50" height="100"> |   闲鱼  |
| <img src="https://imga.3839.com/117535?t=1765556642" width="50" height="100"> |   好游快爆  |
| <img src="http://p3.music.126.net/MT4fcDQM_7eo7NLq9-Ge2A==/109951169275563698.jpg?param=30y30" width="50" height="100"> |   网易云音乐（Web）  |
| <img src="https://img.kookapp.cn/attachments/2026-01/31/vknjuH7RiN0dw0dw.jpeg?x-oss-process=style/icon" width="50" height="100"> |   KOOK  |
| <img src="https://img3-tc.tapimg.com/avatars/etag/FnKeVW2he8X1JwJ33XoFRG02eGVm.png/_tap_avatar_m.jpg" width="50" height="100"> |   TapTap（Web）  |
| <img src="http://wx.qlogo.cn/mmhead/OxUBpiaYgpHgv5ETJhoPFuS7H1d2vuYxvZwb5eia5G1jMAunabN4HLjREsrDUaolsxMX77UXpBzicQ/0" width="50" height="100"> |   （微信）公众号助手  |
| <img src="https://himg.bdimg.com/sys/portrait/item/public.1.32f8f9b.Naa8uLkNmy_npPPyAuyi-A.jpg?1769944805341" width="50" height="100"> |   百度网盘  |
| <img src="https://avatars.akamai.steamstatic.com/e603bd97da45790ad8bfb15648040f599c1aa52d.jpg" width="50" height="100"> |   Steam（Web）  |

# 这表明了什么？
对于图片，音乐，影片等静态资源，若直接使用 `img` `audio` `video` 等标签，无需CORS即可将远端资源在任意网页上展示。这是W3C规范的一部分，详情请参考 [HTML5 嵌入内容](https://www.w3.org/TR/2014/REC-html5-20141028/embedded-content-0.html?utm_source=chatgpt.com)

当然，如果您是一个网站的维护者，您可能不想让陌生人直接将你的资源展示给别人看，或者怕被刷出账单，下面我将简单说明哪些措施是有效的，哪些是掩耳盗铃

首先我们来分辨一下您手动做服务端的防盗链和浏览器CORS的区别：

*浏览器CORS是客户端行为，当某个行为被对端CORS策略拒绝，浏览器会阻止响应体。而服务端防盗链是在您的后端上编写一些小脚本，用以拒绝非法访问。前者会在用户浏览器弹出CORS错误，而后者会在用户浏览器显示错误状态码，如500，401，403，这取决于您的实现*

是否可以尝试设置Referer白名单来拒绝非法访问？ **没用** 因为Referer在浏览器中是可以伪造或者不发送的。详见 [HTML 5 引用来源策略](https://www.w3.org/TR/referrer-policy/all/)

您应该做的事情稍微有些复杂，如将API放到Cookie（登录，非游客权限）中，并且让后端处理Cookie的发放与吊销。就像微软那样

又或者说，您只想要用户仅能通过浏览器单独查看图片，而不让 **任何人（包括您）** 引用图片到网站中，您可以使用 **Accept 请求头** 白名单，您可以尝试比较一下这两个 **Accept 请求头** ，前者是直接访问图片浏览器自动发送的，而后者是引用时发送的

```
text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
```

```
image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8
```

最后，如果您想做到图片必须是 **游客访问** ，又不想让他人滥用。可以使用CORP（Cross-Origin-Resource-Policy）

只需要在别人拉取图片时返回一个CORP响应头，如： **Cross-Origin-Resource-Policy: same-origin** 
> 另外，CORP不仅能保护图片，它可以保护一切东西，下面是一个简单的示意图
> 浏览器拉取资源 -> 请求资源，检查响应头 -> CORP（给不给用，默认给用） -> CORS（给不给JS读，默认不给） -> 返回 

当CORP响应头返回的策略中和将要拉取资源的源不匹配，**浏览器会阻止资源在页面加载，但并不会阻断原始请求**

|      值       |                    描述                     |
| :----------: | :---------------------------------------: |
| same-origin  |        同源。仅允许 `example.com` 拉取对应资源        |
|  same-site   | 同站。仅允许 `*.example.com` `example.com` 拉取资源 |
| cross-origin |          **默认值**。允许所有源，任何人都可以拉取           |

设置后跨站引用会被浏览器阻止

- Chromium（Edge/Chrome）
> 另外提一嘴，Chromium 最近推了一个更新，导致CORS/CORP错误默认不显示在控制台，需要勾选 **显示控制台中的CORS错误** [控制台功能参考  |  Chrome DevTools  |  Chrome for Developers](https://developer.chrome.com/docs/devtools/console/reference?utm_source=chatgpt.com&hl=zh-cn#cors-errors)
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/avatar-1.png)

- Firefox
![](https://cnb.cool/2x.nz/fuwari/-/git/raw/main/src/content/assets/images/avatar-2.png)