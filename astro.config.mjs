import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import swup from "@swup/astro";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import { defineConfig, passthroughImageService } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { SKIP, visit } from "unist-util-visit";
import { imageFallbackConfig, siteConfig } from "./src/config.ts";
import { expressiveCodeConfig } from "./src/config.ts";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { UrlCardComponent } from "./src/plugins/rehype-component-url-card.mjs";
import rehypeImageFallback from "./src/plugins/rehype-image-fallback.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkExcerpt } from "./src/plugins/remark-excerpt.js";
import { remarkGithubAdmonitions } from "./src/plugins/remark-github-admonitions.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { rehypeInjectAds } from "./src/plugins/rehype-inject-ads.mjs";

function remarkSpoiler() {
  return (tree) => {
    visit(tree, "paragraph", (node) => {
      const newChildren = [];
      let inSpoiler = false;
      const hasSpoiler = node.children.some(
        (child) =>
          child.type === "text" && child.value && child.value.includes("||"),
      );
      if (!hasSpoiler) return;

      for (const child of node.children) {
        if (child.type === "text") {
          const parts = child.value.split("||");
          parts.forEach((part, index) => {
            if (part) newChildren.push({ type: "text", value: part });
            if (index < parts.length - 1) {
              if (!inSpoiler) {
                newChildren.push({
                  type: "html",
                  value: '<span class="spoiler" title="点击显示">',
                });
                inSpoiler = true;
              } else {
                newChildren.push({ type: "html", value: "</span>" });
                inSpoiler = false;
              }
            }
          });
        } else {
          newChildren.push(child);
        }
      }
      if (inSpoiler) newChildren.push({ type: "html", value: "</span>" });
      node.children = newChildren;
      return SKIP;
    });
  };
}

// ✅ 你的域名：682000.xyz
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },

  // ==============================================
  // 关键！这里全部改成你的真实域名，不会再跳别人网站
  // ==============================================
  site: "https://2x.nz",
  base: "/",

  trailingSlash: "always",
  output: "static",

  // ==============================================
  // ✅ 所有恶意跳转全部清空！只保留正常内部跳转
  // ==============================================
  redirects: {
    "/privacy-policy": "/posts/privacy-policy/",
    "/tit": "/posts/pin/",
    "/q": "/posts/pin/",
    "/gal": "/posts/gal/",
    "/donate": "/sponsors",
  },

  integrations: [
    tailwind({ nesting: true }),
    swup({
      theme: false,
      animationClass: "transition-swup-",
      containers: ["main", "#toc"],
      smoothScrolling: true,
      cache: true,
      preload: true,
      accessibility: true,
      updateHead: true,
      updateBodyClass: false,
      globalInstance: true,
    }),
    icon({
      include: {
        "fa6-brands": ["*"],
        "fa6-regular": ["*"],
        "fa6-solid": ["*"],
        mingcute: ["*"],
        "simple-icons": ["*"],
        "material-symbols-light": ["*"],
        "material-symbols": ["*"],
      },
      iconDir: "public/icons",
    }),
    svelte(),
    expressiveCode({
      themes: [expressiveCodeConfig.theme, expressiveCodeConfig.theme],
      plugins: [
        pluginCollapsibleSections(),
        pluginLineNumbers(),
        pluginCustomCopyButton(),
      ],
      defaultProps: { wrap: true },
      styleOverrides: {
        codeBackground: "var(--codeblock-bg)",
        borderRadius: "0.25rem",
        borderColor: "none",
        codeFontSize: "0.875rem",
        codeFontFamily:
          "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        codeLineHeight: "1.5rem",
      },
      frames: { showCopyToClipboardButton: false },
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
      rehypeInjectAds,
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
          },
        },
      ],
      [rehypeExternalLinks, { target: "_blank" }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: { className: ["anchor"] },
          content: {
            type: "element",
            tagName: "span",
            properties: { className: ["anchor-icon"] },
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
    ],
  },

  vite: {
    server: {
      allowedHosts: ["682000.xyz", "localhost", "127.0.0.1"],
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.message.includes("dynamically imported by") &&
            warning.message.includes("statically imported")
          )
            return;
          warn(warning);
        },
      },
    },
  },
});