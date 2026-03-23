import { fileURLToPath } from "node:url";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig, passthroughImageService } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components"; /* Render the custom directive content */
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive"; /* Handle directives */
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { SKIP, visit } from "unist-util-visit";
import { imageFallbackConfig, siteConfig } from "./src/config.ts";
import { expressiveCodeConfig } from "./src/config.ts";
// import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { rehypeAIAdmonition } from "./src/plugins/rehype-ai-admonition.mjs";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { UrlCardComponent } from "./src/plugins/rehype-component-url-card.mjs";
import rehypeImageFallback from "./src/plugins/rehype-image-fallback.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkGithubAdmonitions } from "./src/plugins/remark-github-admonitions.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

function remarkSpoiler() {
	return (tree) => {
		visit(tree, "paragraph", (node) => {
			const newChildren = [];
			let inSpoiler = false;

			// Check if any child contains '||'
			const hasSpoiler = node.children.some(
				(child) =>
					child.type === "text" && child.value && child.value.includes("||"),
			);

			if (!hasSpoiler) return;

			for (const child of node.children) {
				if (child.type === "text") {
					const parts = child.value.split("||");

					if (parts.length === 1) {
						newChildren.push(child);
						continue;
					}

					parts.forEach((part, index) => {
						if (part) {
							newChildren.push({ type: "text", value: part });
						}

						if (index < parts.length - 1) {
							if (!inSpoiler) {
								newChildren.push({
									type: "html",
									value: '<span class="spoiler" title="点击显示">',
								});
								inSpoiler = true;
							} else {
								newChildren.push({
									type: "html",
									value: "</span>",
								});
								inSpoiler = false;
							}
						}
					});
				} else {
					newChildren.push(child);
				}
			}

			if (inSpoiler) {
				newChildren.push({
					type: "html",
					value: "</span>",
				});
			}

			node.children = newChildren;
			return SKIP;
		});
	};
}

// https://astro.build/config
export default defineConfig({
	image: {
		service: passthroughImageService(),
	},
	site: "https://2x.nz",
	base: "/",
	trailingSlash: "always",
	output: "static",
	redirects: {
		"/privacy-policy": {
			status: 302,
			destination: "https://2x.nz/posts/privacy-policy/",
		},
		"/long": {
			status: 302,
			destination:
				"https://iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii.in/",
		},
		"/tit": {
			status: 302,
			destination: "/posts/pin/",
		},
		"/q": {
			status: 302,
			destination: "/posts/pin/",
		},
		"/t": {
			status: 302,
			destination: "https://i.2x.nz",
		},
		"/ak": {
			status: 302,
			destination:
				"https://akile.io/register?aff_code=503fe5ea-e7c5-4d68-ae05-6de99513680e",
		},
		"/yyb": {
			status: 302,
			destination: "https://www.rainyun.com/acofork_?s=bilibili",
		},
		"/wly": {
			status: 302,
			destination: "https://wl.awcmam.com/#/register?code=FNQwOQBM",
		},
		"/mly": {
			status: 302,
			destination: "https://muleyun.com/aff/GOTRJLPN",
		},
		"/tly": {
			status: 302,
			destination: "https://tianlicloud.cn/aff/HNNCFKGP",
		},
		"/kook": {
			status: 302,
			destination: "https://kook.vip/K29zpT",
		},
		"/gal": {
			status: 302,
			destination: "/post/gal/",
		},
		"/ok": {
			status: 302,
			destination: "https://acofork-uptime.zeabur.app/status/acofork",
		},
		"/donate": {
			status: 302,
			destination: "/sponsors",
		},
		"/tg": {
			status: 302,
			destination: "https://t.me/+_07DERp7k1ljYTc1",
		},
		"/esa": {
			status: 302,
			destination:
				"https://tianchi.aliyun.com/specials/promotion/freetier/esa?taskCode=25254&recordId=c856e61228828a0423417a767828d166",
		},
		"/s": {
			status: 302,
			destination: "https://2x.nz/_url",
		},
		"/plan": {
			status: 302,
			destination:
				"https://acofork.notion.site/2e11e011d4e5800fa050e8f7cf448347",
		},
		"/iku": {
			status: 302,
			destination: "https://ikuuu.de/",
		},
	},
	integrations: [
		tailwind({
			nesting: true,
		}),
		swup({
			theme: false,
			animationClass: "transition-swup-", // see https://swup.js.org/options/#animationselector
			// the default value `transition-` cause transition delay
			// when the Tailwind class `transition-all` is used
			containers: ["#sort-container", "#swup-container", "#toc"],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
			init: false,
		}),
		icon({
			iconDir: "public/icons",
		}),
		svelte({
			compilerOptions: {
				compatibility: {
					componentApi: 4,
				},
			},
		}),
		expressiveCode({
			themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				// pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "var(--codeblock-bg)",
				borderRadius: "0.25rem",
				borderColor: "none",
				codeFontSize: "0.875rem",
				codeFontFamily:
					"'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
				codeLineHeight: "1.5rem",
				frames: {
					editorBackground: "var(--codeblock-bg)",
					terminalBackground: "var(--codeblock-bg)",
					terminalTitlebarBackground: "var(--codeblock-topbar-bg)",
					editorTabBarBackground: "var(--codeblock-topbar-bg)",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "var(--primary)",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "var(--codeblock-topbar-bg)",
					terminalTitlebarBorderBottomColor: "none",
				},
				textMarkers: {
					delHue: 0,
					insHue: 180,
					markHue: 250,
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
	],
	markdown: {
		remarkPlugins: [
			remarkSpoiler,
			remarkMath,
			remarkReadingTime,
			remarkExcerpt,
			remarkGithubAdmonitions,
			remarkDirective,
			remarkSectionize,
			parseDirectiveNode,
		],
		rehypePlugins: [
			rehypeKatex,
			rehypeSlug,
			[rehypeImageFallback, imageFallbackConfig],
			[
				rehypeComponents,
				{
					components: {
						github: GithubCardComponent,
						url: UrlCardComponent,
						note: (x, y) => AdmonitionComponent(x, y, "note"),
						tip: (x, y) => AdmonitionComponent(x, y, "tip"),
						important: (x, y) => AdmonitionComponent(x, y, "important"),
						caution: (x, y) => AdmonitionComponent(x, y, "caution"),
						warning: (x, y) => AdmonitionComponent(x, y, "warning"),
						ai: (x, y) => AdmonitionComponent(x, y, "ai"),
					},
				},
			],
			rehypeAIAdmonition,
			[
				rehypeExternalLinks,
				{
					target: "_blank",
				},
			],
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor"],
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
							"data-pagefind-ignore": true,
						},
						children: [
							{
								type: "text",
								value: "#",
							},
						],
					},
				},
			],
		],
	},
	vite: {
		resolve: {
			alias: [
				{
					find: /^@iconify\/svelte$/,
					replacement: fileURLToPath(
						new URL(
							"./node_modules/@iconify/svelte/dist/Icon.svelte",
							import.meta.url,
						),
					),
				},
				{
					find: /^@iconify\/svelte\/dist\/Icon\.svelte$/,
					replacement: fileURLToPath(
						new URL(
							"./node_modules/@iconify/svelte/dist/Icon.svelte",
							import.meta.url,
						),
					),
				},
			],
		},
		server: {
			allowedHosts: ["2x.nz"],
		},
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					// temporarily suppress this warning
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
		},
	},
});
