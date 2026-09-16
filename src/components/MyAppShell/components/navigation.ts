import { linkOptions } from "@tanstack/react-router";
import { FilmIcon, HomeIcon, TvIcon } from "lucide-react";

/** Shared by the desktop sidebar and the mobile bottom bar so they cannot drift. */
export const navOptions = linkOptions([
	{ to: "/", activeOptions: { exact: true } },
	{ to: "/movies" },
	{ to: "/tv-shows" },
]);

export const navMeta = {
	"/": { label: "Home", Icon: HomeIcon },
	"/movies": { label: "Movies", Icon: FilmIcon },
	"/tv-shows": { label: "TV Shows", Icon: TvIcon },
} as const;
