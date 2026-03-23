import { LinkPreset, type NavBarLink } from "@/types/config";

export const LinkPresets: { [key in LinkPreset]: NavBarLink } = {
	[LinkPreset.Home]: {
		name: "首页",
		url: "/",
		icon: "material-symbols:home-outline-rounded",
	},
	[LinkPreset.Archive]: {
		name: "归档",
		url: "/archive/",
		icon: "material-symbols:archive-outline-rounded",
	},
};
