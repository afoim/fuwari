import type {
    ExpressiveCodeConfig,
	GitHubEditConfig,
	ImageFallbackConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
	UmamiConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "AcoFork Blog",
	subtitle: "技术分享与实践",
	description:
		"分享网络技术、服务器部署、内网穿透、静态网站搭建、CDN优化、容器化部署等技术教程与实践经验的个人技术博客，专注于云原生、无服务器架构和前后端开发，作者为afoim/二叉树树",

	keywords: [],
	lang: "zh_CN", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 361, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
		forceDarkMode: false, // Force dark mode and hide theme switcher
	},
	banner: {
		enable: false,
		src: "/xinghui.avif", // Relative to the /src directory. Relative to the /public directory if it starts with '/'

		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: true, // Display the credit text of the banner image
			text: "Pixiv @chokei", // Credit text to be displayed

			url: "https://www.pixiv.net/artworks/122782209", // (Optional) URL link to the original artwork or artist's page
		},
	},
	background: {
		enable: true, // Enable background image
		src: "https://eopfapi.b.2.f.f.0.7.4.0.1.0.0.2.ip6.arpa/pic?img=ua", // Background image URL (supports HTTPS)
		position: "center", // Background position: 'top', 'center', 'bottom'
		size: "cover", // Background size: 'cover', 'contain', 'auto'
		repeat: "no-repeat", // Background repeat: 'no-repeat', 'repeat', 'repeat-x', 'repeat-y'
		attachment: "fixed", // Background attachment: 'fixed', 'scroll', 'local'
		opacity: 0.5, // Background opacity (0-1)
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0", // Path of the favicon, relative to the /public directory
			//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
	officialSites: [
		{ url: "https://blog.2b2x.cn", alias: "EdgeOne CN" },
		{ url: "https://2x.nz", alias: "Vercel" },
		
		{ url: "https://b.2.f.f.0.7.4.0.1.0.0.2.ip6.arpa", alias: "Cloudflare" },
		{ url: "http://localhost:4321", alias: "Dev" }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "友链",
			url: "/friends/", // Internal links should not include the base path, as it is automatically added
			external: false, // Show an external link icon and will open in a new tab
		},
		{
			name: "赞助",
			url: "/sponsors/", // Internal links should not include the base path, as it is automatically added
			external: false, // Show an external link icon and will open in a new tab
		},
		{
			name: "统计",
			url: "https://umami.2b2x.cn/share/CdkXbGgZr6ECKOyK", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
		{
			name: "状态",
			url: "https://stats.uptimerobot.com/VAtAH0mzPN", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=2726730791&spec=0", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "二叉树树",
	bio: "Protect What You Love.",
	links: [
		{
			name: "Bilibli",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/325903362",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/afoim",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const imageFallbackConfig: ImageFallbackConfig = {
	enable: true,
	originalDomain: "eopfapi.2b2x.cn",
	fallbackDomain: "eopfapi.b.2.f.f.0.7.4.0.1.0.0.2.ip6.arpa/pic?img=ua",
};

export const umamiConfig: UmamiConfig = {
	enable: true,
	baseUrl: "https://umami.2b2x.cn",
	shareId: "CdkXbGgZr6ECKOyK",
	timezone: "Asia/Shanghai",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};

export const gitHubEditConfig: GitHubEditConfig = {
	enable: true,
	baseUrl: "https://github.com/afoim/fuwari/blob/main/src/content/posts",
};

// todoConfig removed from here