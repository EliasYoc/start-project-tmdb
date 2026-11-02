import type {
	BackdropSize,
	LogoSize,
	PosterSize,
	ProfileSize,
} from "@lorenzopant/tmdb/image";
import { ImageAPI } from "@lorenzopant/tmdb/image";

/**
 * Client-safe: `ImageAPI` only builds `image.tmdb.org` URLs, it never touches the
 * access token, so importing it from components does not drag the server client in.
 */
const images = new ImageAPI();

export function posterUrl(
	path: string | undefined,
	size: PosterSize = "w342",
): string | null {
	return path ? images.poster(path, size) : null;
}

export function backdropUrl(
	path: string | undefined,
	size: BackdropSize = "w1280",
): string | null {
	return path ? images.backdrop(path, size) : null;
}

export function profileUrl(
	path: string | undefined,
	size: ProfileSize = "w185",
): string | null {
	return path ? images.profile(path, size) : null;
}

/** Streaming services and stores always come with a logo on TMDB. */
export function logoUrl(path: string, size: LogoSize = "w92"): string {
	return images.logo(path, size);
}
