import type { TodoConfig } from "@/types/config";

export const todoConfig: TodoConfig = {
    enable: true,
    title: "待办事项",
    items: [
        { content: "为博客添加”待办事项“功能", completed: true },
        { content: "做视频：利用STUN在世界各地连接上你的电脑", completed: false  },
        { content: "做视频：Ventoy+FirPE使用（可能不会做）", completed: false },
		{ content: "做视频：Cloudflare 利用Origin Rules 6转4 访问家里云", completed: false },
        { content: "做视频：anuneko.com米哈游AI上手体验", completed: false },
        { content: "做Bot插件：anuneko.com米哈游AI聊天机器人", completed:true },
		{ content: "UP养成计划-目标一：10000", completed: false },
    ],
};
