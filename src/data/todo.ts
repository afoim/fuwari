import type { TodoConfig } from "@/types/config";

export const todoConfig: TodoConfig = {
    enable: true,
    title: "待办事项",
    items: [
        { content: "为博客添加”待办事项“功能", completed: true },
        { content: "做视频：利用STUN在世界各地连接上你的电脑", completed: true  },
        { content: "做视频：Ventoy+FirPE使用（可能不会做）", completed: false },
		{ content: "做视频：Cloudflare 利用Origin Rules 6转4 访问家里云", completed: false },
        { content: "做视频：如何使用OBS优雅的录视频", completed: false },
        { content: "写文章：Umami迁移记录", completed: true },
        { content: "自建Umami并从云迁移到自建", completed: true },
        { content: "更改文章底下的链接，用正则删去查询（?=xxx）", completed: true },
        { content: "做视频：anuneko.com米哈游AI上手体验", completed: true },
        { content: "完善Bot插件：anuneko.com米哈游AI聊天机器人（支持pick）", completed: true },
        { content: "写文章：当anuneko bot插件完善后，编写开发文章", completed: true },
        { content: "更新文章：Serverless，添加Render，Zeabur", completed: true },
    ],
};
