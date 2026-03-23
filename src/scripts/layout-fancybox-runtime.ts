import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const fancyboxOptions = {
	wheel: "zoom",
	clickContent: "close",
	dblclickContent: "zoom",
	click: "close",
	dblclick: "zoom",
	Panels: {
		display: ["counter", "zoom"],
	},
	Images: {
		panning: true,
		zoom: true,
		protect: false,
	},
};

Fancybox.bind(".custom-md img, #post-cover img", fancyboxOptions);

const setup = () => {
	const cleanupFancybox = () => {
		try {
			Fancybox.close();
		} catch {}
		document.querySelectorAll(".fancybox__container").forEach(el => el.remove());
		document.documentElement.style.removeProperty("overflow");
		document.body.style.removeProperty("overflow");
	};
	const restoreNativeScrollIfSafe = () => {
		const hasFancybox = !!document.querySelector(".fancybox__container");
		const hasCookieModal = !!document.querySelector(
			".cc_overlay, .cc_modal, .cc_preferences, .cc_dialog, .cc_cp, .cc_nb, .cc_banner",
		);
		if (hasFancybox || hasCookieModal) return;
		document.documentElement.style.removeProperty("overflow");
		document.body.style.removeProperty("overflow");
	};

	window.swup.hooks.on("page:view", () => {
		Fancybox.bind(".custom-md img, #post-cover img", fancyboxOptions);
	});

	window.swup.hooks.on(
		"content:replace",
		() => {
			cleanupFancybox();
			Fancybox.unbind(".custom-md img, #post-cover img");
		},
		{ before: true },
	);

	window.swup.hooks.on(
		"visit:start",
		() => {
			cleanupFancybox();
		},
		{ before: true },
	);

	window.addEventListener("keydown", e => {
		if (e.key !== "Escape") return;
		setTimeout(restoreNativeScrollIfSafe, 0);
	});
	document.addEventListener(
		"click",
		() => {
			setTimeout(restoreNativeScrollIfSafe, 0);
		},
		true,
	);
};

const initSwup = () => {
	if (window.swup && !window.swup.initialized) {
		window.swup.init();
	}
};

if (document.readyState !== "loading") {
	initSwup();
} else {
	document.addEventListener("DOMContentLoaded", initSwup);
}

if (window.swup) {
	setup();
} else {
	document.addEventListener("swup:enable", setup);
}
