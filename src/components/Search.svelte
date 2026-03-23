<script lang="ts">
import Icon from "@iconify/svelte";
import { addCollection } from "@iconify/svelte";
import materialSymbols from "@iconify-json/material-symbols/icons.json";
import fa6Solid from "@iconify-json/fa6-solid/icons.json";
import { url } from "@utils/url-utils.ts";
import { onMount } from "svelte";
import Highlight from "./Highlight.svelte";

addCollection(materialSymbols);
addCollection(fa6Solid);

interface SearchResult {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
	urlPath?: string;
	highlightQuery?: string;
	matchCount: number;
}

interface SearchPost {
	title: string;
	description: string;
	content: string;
	link: string;
}

let keywordDesktop = "";
let keywordMobile = "";
let result: SearchResult[] = [];
let isSearching = false;
let posts: SearchPost[] = [];
let hasLoadedPosts = false;
let isLoadingPosts = false;
let searchTimer: ReturnType<typeof setTimeout> | undefined;

const searchTypes = [
	{ id: "title", label: "标题" },
	{ id: "description", label: "简介" },
	{ id: "content", label: "正文" },
	{ id: "link", label: "路径" },
];
let selectedTypes: string[] = [];
let isMultiSelect = false;

const toggleType = (typeId: string) => {
	if (isMultiSelect) {
		if (selectedTypes.includes(typeId)) {
			selectedTypes = selectedTypes.filter((t) => t !== typeId);
		} else {
			selectedTypes = [...selectedTypes, typeId];
		}
	} else {
		if (selectedTypes.includes(typeId) && selectedTypes.length === 1) {
			selectedTypes = [];
		} else {
			selectedTypes = [typeId];
		}
	}
};

const togglePanel = () => {
	if (typeof document === "undefined") return;
	const panel = document.getElementById("search-panel");
	panel?.classList.toggle("float-panel-closed");
};

const closePanel = () => {
	if (typeof document === "undefined") return;
	const panel = document.getElementById("search-panel");
	panel?.classList.add("float-panel-closed");
};

const openPanel = () => {
	if (typeof document === "undefined") return;
	const panel = document.getElementById("search-panel");
	panel?.classList.remove("float-panel-closed");
};

const setPanelVisibility = (show: boolean): void => {
	if (typeof document === "undefined") return;
	const panel = document.getElementById("search-panel");
	if (!panel) return;

	if (show) {
		panel.classList.remove("float-panel-closed");
	} else {
		panel.classList.add("float-panel-closed");
	}
};

const loadPostsFromRss = async (): Promise<SearchPost[]> => {
	const response = await fetch("/rss.xml");
	const text = await response.text();
	const parser = new DOMParser();
	const xml = parser.parseFromString(text, "text/xml");
	const items = xml.querySelectorAll("item");

	return Array.from(items).map((item) => {
		let content = "";
		const contentEncoded =
			item.getElementsByTagNameNS("*", "encoded")[0]?.textContent ||
			item.querySelector("*|encoded")?.textContent ||
			"";

		if (contentEncoded) {
			content = contentEncoded.replace(/<[^>]*>/g, "");
		}

		return {
			title: item.querySelector("title")?.textContent || "",
			description: item.querySelector("description")?.textContent || "",
			content,
			link:
				item
					.querySelector("link")
					?.textContent?.replace(/.*\/posts\/(.*?)\//, "$1") || "",
		};
	});
};

const ensurePostsLoaded = async (): Promise<void> => {
	if (hasLoadedPosts || isLoadingPosts) return;
	isLoadingPosts = true;

	try {
		const cached = sessionStorage.getItem("search-posts-cache");
		if (cached) {
			posts = JSON.parse(cached) as SearchPost[];
			hasLoadedPosts = true;
			return;
		}

		try {
			const response = await fetch("/search.json");
			if (response.ok) {
				posts = (await response.json()) as SearchPost[];
			} else {
				posts = await loadPostsFromRss();
			}
		} catch {
			posts = await loadPostsFromRss();
		}

		hasLoadedPosts = true;
		sessionStorage.setItem("search-posts-cache", JSON.stringify(posts));
	} catch (error) {
		console.error("Error loading search data:", error);
		posts = [];
		hasLoadedPosts = true;
	} finally {
		isLoadingPosts = false;
	}
};

const scheduleSearchDataPreload = (): void => {
	if (typeof window === "undefined") return;
	window.setTimeout(() => {
		void ensurePostsLoaded();
	}, 300);
};

const search = async (
	keyword: string,
	isDesktop: boolean,
	types: string[] = selectedTypes,
): Promise<void> => {
	if (!keyword) {
		setPanelVisibility(false);
		result = [];
		return;
	}

	isSearching = true;

	try {
		const keywords = keyword
			.toLowerCase()
			.split(/\s+/)
			.filter((k) => k.length > 0);

		const searchResults = posts
			.filter((post) => {
				const titleLower = post.title.toLowerCase();
				const descriptionLower = post.description.toLowerCase();
				const contentLower = post.content.toLowerCase();
				const linkLower = post.link.toLowerCase();

				let searchText = "";
				if (types.length === 0) {
					searchText = `${titleLower} ${descriptionLower} ${contentLower} ${linkLower}`;
				} else {
					if (types.includes("title")) searchText += ` ${titleLower}`;
					if (types.includes("description"))
						searchText += ` ${descriptionLower}`;
					if (types.includes("content")) searchText += ` ${contentLower}`;
					if (types.includes("link")) searchText += ` ${linkLower}`;
				}

				return keywords.every((k) => searchText.includes(k));
			})
			.map((post) => {
				const titleLower = post.title.toLowerCase();
				const descriptionLower = post.description.toLowerCase();
				const contentLower = post.content.toLowerCase();
				const linkLower = post.link.toLowerCase();

				let excerpt = "";
				const firstKeyword = keywords[0];
				const contentIndex = contentLower.indexOf(firstKeyword);
				if (contentIndex !== -1) {
					const start = Math.max(0, contentIndex - 50);
					const end = Math.min(post.content.length, contentIndex + 100);
					excerpt = post.content.substring(start, end);
					if (start > 0) excerpt = `...${excerpt}`;
					if (end < post.content.length) excerpt = `${excerpt}...`;
				} else {
					excerpt = post.description || `${post.content.substring(0, 150)}...`;
				}

				let matchCount = 0;
				keywords.forEach((k) => {
					const regex = new RegExp(
						k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
						"gi",
					);

					if (types.length === 0 || types.includes("title")) {
						const matches = titleLower.match(regex);
						if (matches) matchCount += matches.length;
					}
					if (types.length === 0 || types.includes("description")) {
						const matches = descriptionLower.match(regex);
						if (matches) matchCount += matches.length;
					}
					if (types.length === 0 || types.includes("content")) {
						const matches = contentLower.match(regex);
						if (matches) matchCount += matches.length;
					}
					if (types.length === 0 || types.includes("link")) {
						const matches = linkLower.match(regex);
						if (matches) matchCount += matches.length;
					}
				});

				return {
					url: url(`/posts/${post.link}/`),
					meta: { title: post.title },
					excerpt,
					urlPath: `/posts/${post.link}`,
					highlightQuery: keyword,
					matchCount,
				};
			})
			.sort((a, b) => b.matchCount - a.matchCount);

		result = searchResults;
		setPanelVisibility(true);
	} catch (error) {
		console.error("Search error:", error);
		result = [];
		setPanelVisibility(true);
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	scheduleSearchDataPreload();
});

$: {
	if (keywordDesktop) {
		if (searchTimer) {
			clearTimeout(searchTimer);
		}
		searchTimer = setTimeout(async () => {
			await ensurePostsLoaded();
			await search(keywordDesktop, true, selectedTypes);
		}, 120);
	} else if (keywordMobile) {
		if (searchTimer) {
			clearTimeout(searchTimer);
		}
		searchTimer = setTimeout(async () => {
			await ensurePostsLoaded();
			await search(keywordMobile, false, selectedTypes);
		}, 120);
	} else {
		if (searchTimer) {
			clearTimeout(searchTimer);
		}
		result = [];
		setPanelVisibility(false, true);
	}
}
</script>

<!-- search bar for desktop view -->
<div id="search-bar" class="hidden lg:flex transition-all items-center h-11 mr-2 rounded-lg
      bg-white/5 hover:bg-white/10 focus-within:bg-white/10
">
    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-white/30"></Icon>
    <input placeholder="搜索" bind:value={keywordDesktop} on:focus={() => void ensurePostsLoaded()}
           class="transition-all pl-10 text-sm bg-transparent outline-0
         h-full w-40 active:w-60 focus:w-60 text-white/50"
    >
</div>

<!-- search bar for phone/tablet view -->
<div class="relative flex h-11 flex-1 items-center rounded-lg bg-white/5 transition hover:bg-white/10 focus-within:bg-white/10 lg:hidden">
    <Icon icon="material-symbols:search" class="pointer-events-none absolute ml-3 text-[1.25rem] text-white/30 transition"></Icon>
    <input placeholder="搜索" bind:value={keywordMobile} on:focus={() => { void ensurePostsLoaded(); openPanel(); }}
           class="h-full w-full rounded-lg bg-transparent pl-10 pr-3 text-sm text-white/50 outline-0"
    >
</div>

<!-- search panel -->
<div id="search-panel" class="float-panel float-panel-closed search-panel absolute md:w-[30rem]
top-20 left-4 md:left-[unset] right-4 shadow-none rounded-2xl p-2">

    <!-- search bar inside panel for phone/tablet -->
    <div id="search-bar-inside" class="hidden relative lg:hidden transition-all items-center h-11 rounded-xl
      bg-white/5 hover:bg-white/10 focus-within:bg-white/10
  ">
        <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-white/30"></Icon>
        <input placeholder="搜索" bind:value={keywordMobile} on:focus={() => void ensurePostsLoaded()}
               class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-white/50"
        >
    </div>

    <!-- search types -->
    <div class="flex flex-wrap gap-2 px-3 py-2 border-b border-white/5 items-center">
        <button 
            class="px-2 py-1 text-xs rounded-md transition-all flex items-center gap-1 {isMultiSelect ? 'bg-[var(--primary)] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}"
            on:click={() => {
                isMultiSelect = !isMultiSelect;
                if (!isMultiSelect && selectedTypes.length > 1) {
                    selectedTypes = [selectedTypes[0]];
                }
            }}
        >
            <Icon icon={isMultiSelect ? "material-symbols:check-box" : "material-symbols:check-box-outline-blank"} class="text-sm" />
            多选
        </button>
        <div class="w-[1px] h-3 bg-white/10 mx-1"></div>
        {#each searchTypes as type}
            <button 
                class="px-2 py-1 text-xs rounded-md transition-all {selectedTypes.includes(type.id) ? 'bg-[var(--primary)] text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}"
                on:click={() => toggleType(type.id)}
            >
                {type.label}
            </button>
        {/each}
    </div>

    {#if keywordDesktop || keywordMobile}
        <!-- search results header -->
        {#if result.length > 0}
            <div class="text-xs text-white/40 px-3 py-2 border-b border-white/5">
                {result.length} 条搜索结果
            </div>
        {/if}

        <!-- search results -->
        {#each result as item}
            <a href={item.url} on:click={closePanel}
               class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
           rounded-xl text-lg px-3 py-2 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
                <div class="transition text-90 inline-flex font-bold group-hover:text-[var(--primary)]">
                    <Highlight text={item.meta.title} query={item.highlightQuery} />
                    <Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-[var(--primary)]"></Icon>
                </div>
                <div class="transition text-xs text-white/50 mb-1 font-mono">
                    <Highlight text={item.urlPath} query={item.highlightQuery} />
                    <span class="ml-2 text-[var(--primary)]">命中 {item.matchCount} 个关键词</span>
                </div>
                <div class="transition text-sm text-50">
                    <Highlight text={item.excerpt} query={item.highlightQuery} />
                </div>
            </a>
        {/each}

        {#if !isSearching && result.length === 0}
            <div class="text-sm text-white/50 px-3 py-4">
                无搜索结果
            </div>
        {/if}
    {/if}
</div>

<style>
  :global(.hl) {
    color: var(--primary);
  }
  :global(.hl.no-wrap) {
    white-space: nowrap;
    display: inline-block;
  }
  input:focus {
    outline: 0;
  }
  .search-panel {
    background-color: var(--float-panel-bg-opaque);
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .search-panel::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  .search-panel :global(mark) {
    color: var(--primary);
    background: none;
  }
</style>
