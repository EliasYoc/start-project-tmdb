import {
	IconDeviceTv,
	IconDeviceTvFilled,
	IconHome,
	IconHomeFilled,
	IconMovie,
} from "@tabler/icons-react";
import { linkOptions } from "@tanstack/react-router";
import { IconMovieFilled } from "#/components/icons/IconMovieFilled";

// Single source for the app's primary destinations: the desktop navbar and the
// mobile tab bar both render from this list, so they can't drift apart.
export const navLinks = linkOptions([
	{
		to: "/",
		label: "Home",
		icon: IconHome,
		activeIcon: IconHomeFilled,
		activeOptions: { exact: true },
	},
	{
		to: "/movies",
		label: "Movies",
		icon: IconMovie,
		activeIcon: IconMovieFilled,
	},
	{
		to: "/tv-shows",
		label: "TV Shows",
		icon: IconDeviceTv,
		activeIcon: IconDeviceTvFilled,
	},
]);
