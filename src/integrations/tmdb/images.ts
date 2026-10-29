import type { BackdropSize, PosterSize } from "@lorenzopant/tmdb/image";
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
