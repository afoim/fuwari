import { siteConfig } from "../config";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_HOME,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "../constants/constants";
import { bindPostInlineDiff } from "../scripts/post-inline-diff";
import {
	getBgBlur,
	getHideBg,
	getHue,
	setBgBlur,
	setHideBg,
	setHue,
	setTheme,
} from "../utils/setting-utils";
import { url, pathsEqual } from "../utils/url-utils";

const bannerEnabled = !!document.getElementById("banner-wrapper");

function setClickOutsideToClose(panel: string, ignores: string[]) {
	document.addEventListener("click", (event) => {
		const panelDom = document.getElementById(panel);
		const tDom = event.target;
		if (!(tDom instanceof Node)) return;
		for (const ig of ignores) {
			const ie = document.getElementById(ig);
			if (ie == tDom || ie?.contains(tDom)) {
				return;
			}
		}
		panelDom!.classList.add("float-panel-closed");
	});
}
setClickOutsideToClose("display-setting", [
	"display-setting",
	"display-settings-switch",
]);
setClickOutsideToClose("nav-menu-panel", ["nav-menu-panel", "nav-menu-switch"]);
setClickOutsideToClose("search-panel", [
	"search-panel",
	"search-bar",
	"search-switch",
]);

function loadTheme() {
	setTheme();
}

function loadHue() {
	setHue(getHue());
}

function loadBgBlur() {
	setBgBlur(getBgBlur());
	setHideBg(getHideBg());
}

function showBanner() {
	if (!siteConfig.banner.enable) return;

	const banner = document.getElementById("banner");
	if (!banner) {
		console.error("Banner element not found");
		return;
	}

	banner.classList.remove("opacity-0", "scale-105");
}

function loadGiscus() {
	const container = document.getElementById("giscus-container");
	if (!container) return;

	if (
		container.querySelector("iframe.giscus-frame") ||
		container.querySelector('script[src*="giscus"]')
	)
		return;

	const script = document.createElement("script");
	script.src = "https://giscus.app/client.js";
	const attributes = [
		"data-repo",
		"data-repo-id",
		"data-category",
		"data-category-id",
		"data-mapping",
		"data-strict",
		"data-reactions-enabled",
		"data-emit-metadata",
		"data-input-position",
		"data-lang",
		"data-loading",
	];
	attributes.forEach((attr) => {
		const val = container.getAttribute(attr);
		if (val) script.setAttribute(attr, val);
	});
	script.setAttribute("data-theme", "dark");
	script.crossOrigin = "anonymous";
	script.async = true;

	container.appendChild(script);
}

function init() {
	loadTheme();
	loadHue();
	loadBgBlur();
	showBanner();
	loadGiscus();

	new MutationObserver(() => {
		const frame = document.querySelector("iframe.giscus-frame");
		if (!frame) return;
		frame.contentWindow.postMessage(
			{ giscus: { setConfig: { theme: "dark" } } },
			"https://giscus.app",
		);
	}).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});
}

init();
bindPostInlineDiff();

const setup = () => {
	const SORT_PATHS = [
		"/",
		"/date-asc/",
		"/date-desc/",
		"/alpha-asc/",
		"/alpha-desc/",
	];

	const isSortPath = (pathname: string): boolean => {
		const clean = pathname.replace(/\/+$/, "") || "/";
		return SORT_PATHS.some((p) => {
			const cleanP = p.replace(/\/+$/, "") || "/";
			return clean === cleanP || clean.startsWith(cleanP + "/");
		});
	};

	window.swup.hooks.on("link:click", (visit: { el?: HTMLElement }) => {
		document.documentElement.style.setProperty("--content-delay", "0ms");

		if (!bannerEnabled) {
			return;
		}
		const threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 72 - 16;
		const navbar = document.getElementById("navbar-wrapper");
		if (!navbar || !document.body.classList.contains("lg:is-home")) {
			return;
		}
		if (
			document.body.scrollTop >= threshold ||
			document.documentElement.scrollTop >= threshold
		) {
			navbar.classList.add("navbar-hidden");
		}
	});
	window.swup.hooks.on(
		"visit:start",
		(visit: { to: { url: string }; containers?: string[] }) => {
			const bodyElement = document.querySelector("body");
			if (pathsEqual(visit.to.url, url("/"))) {
				bodyElement!.classList.add("lg:is-home");
			} else {
				bodyElement!.classList.remove("lg:is-home");
			}

			const heightExtend = document.getElementById("page-height-extend");
			if (heightExtend) {
				heightExtend.classList.remove("hidden");
			}

			const toc = document.getElementById("toc-wrapper");
			if (toc) {
				toc.classList.add("toc-not-ready");
			}

			// Fragment-like behavior: if navigating between sort pages, only refresh article list
			const currentPath = window.location.pathname;
			const targetPath = new URL(visit.to.url, window.location.origin).pathname;
			const sortContainer = document.getElementById("sort-container");

			if (isSortPath(currentPath) && isSortPath(targetPath)) {
				// Navigating between sort pages: only refresh article list
				visit.containers = ["#swup-container"];
				// Prevent sort container from animating out
				if (sortContainer) {
					sortContainer.classList.add("sort-keep");
				}
			} else if (sortContainer) {
				// Navigating away or to sort page: let sort container animate normally
				sortContainer.classList.remove("sort-keep");
			}
		},
	);
	window.swup.hooks.on("page:view", () => {
		const heightExtend = document.getElementById("page-height-extend");
		if (heightExtend) {
			heightExtend.classList.remove("hidden");
		}
		scrollFunction();
		loadGiscus();
	});
	window.swup.hooks.on("visit:end", (_visit: { to: { url: string } }) => {
		setTimeout(() => {
			const heightExtend = document.getElementById("page-height-extend");
			if (heightExtend) {
				heightExtend.classList.add("hidden");
			}

			const toc = document.getElementById("toc-wrapper");
			if (toc) {
				toc.classList.remove("toc-not-ready");
			}

			// Clean up sort-keep class
			const sortContainer = document.getElementById("sort-container");
			if (sortContainer) {
				sortContainer.classList.remove("sort-keep");
			}
		}, 200);
	});
};
if (window?.swup?.hooks) {
	setup();
} else {
	document.addEventListener("swup:enable", setup);
}

let backToTopBtn = document.getElementById("back-to-top-btn");
let goToCommentsBtn = document.getElementById("go-to-comments-btn");
let toc = document.getElementById("toc-wrapper");
let navbar = document.getElementById("navbar-wrapper");
function refreshControlRefs() {
	backToTopBtn = document.getElementById("back-to-top-btn");
	goToCommentsBtn = document.getElementById("go-to-comments-btn");
	toc = document.getElementById("toc-wrapper");
	navbar = document.getElementById("navbar-wrapper");
}
function scrollFunction() {
	refreshControlRefs();
	const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);

	if (backToTopBtn) {
		if (
			document.body.scrollTop > bannerHeight ||
			document.documentElement.scrollTop > bannerHeight
		) {
			backToTopBtn.classList.remove("hide");
		} else {
			backToTopBtn.classList.add("hide");
		}
	}

	if (goToCommentsBtn) {
		const commentsExist = !!document.getElementById("giscus-container");
		if (commentsExist) {
			goToCommentsBtn.classList.remove("hide");
		} else {
			goToCommentsBtn.classList.add("hide");
		}
	}

	if (bannerEnabled && toc) {
		if (
			document.body.scrollTop > bannerHeight ||
			document.documentElement.scrollTop > bannerHeight
		) {
			toc.classList.remove("toc-hide");
		} else {
			toc.classList.add("toc-hide");
		}
	}

	if (!bannerEnabled) return;
	if (navbar) {
		const NAVBAR_HEIGHT = 72;
		const MAIN_PANEL_EXCESS_HEIGHT = MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16;

		let bannerHeight = BANNER_HEIGHT;
		if (
			document.body.classList.contains("lg:is-home") &&
			window.innerWidth >= 1024
		) {
			bannerHeight = BANNER_HEIGHT_HOME;
		}
		const threshold =
			window.innerHeight * (bannerHeight / 100) -
			NAVBAR_HEIGHT -
			MAIN_PANEL_EXCESS_HEIGHT -
			16;
		if (
			document.body.scrollTop >= threshold ||
			document.documentElement.scrollTop >= threshold
		) {
			navbar.classList.add("navbar-hidden");
		} else {
			navbar.classList.remove("navbar-hidden");
		}
	}
}
let scrollTicking = false;
window.onscroll = () => {
	if (!scrollTicking) {
		requestAnimationFrame(() => {
			scrollFunction();
			scrollTicking = false;
		});
		scrollTicking = true;
	}
};
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", scrollFunction);
} else {
	scrollFunction();
}

window.onresize = () => {
	let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
	offset = offset - (offset % 4);
	document.documentElement.style.setProperty(
		"--banner-height-extend",
		`${offset}px`,
	);
};
