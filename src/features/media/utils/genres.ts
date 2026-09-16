import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { tmdb } from "#/integrations/tmdb/tmdb.server";
import type { MediaItem } from "./media";

export type GenreIndex = {
	movie: Record<number, string>;
	tv: Record<number, string>;
};

/**
 * Movie and TV genre ids overlap with different meanings (10759 is
 * "Action & Adventure" on TV only), so the two lists stay separate.
 */
const fetchGenres = createServerFn().handler(async (): Promise<GenreIndex> => {
	const [movies, tv] = await Promise.all([
		tmdb.genres.movie_list(),
		tmdb.genres.tv_list(),
	]);

	const index = (genres: { id: number; name: string }[]) =>
		Object.fromEntries(genres.map((genre) => [genre.id, genre.name]));

	return { movie: index(movies.genres), tv: index(tv.genres) };
});

export const getGenresQueryOptions = () =>
	queryOptions({
		queryKey: ["genres"],
		queryFn: () => fetchGenres(),
		// The official genre lists change once or twice a year.
		staleTime: Infinity,
	});

export function genreNames(
	item: Pick<MediaItem, "mediaType" | "genreIds">,
	genres: GenreIndex | undefined,
	limit = 2,
): string[] {
	if (!genres) return [];
	const byId = genres[item.mediaType];
	return item.genreIds
		.map((id) => byId[id])
		.filter((name): name is string => Boolean(name))
		.slice(0, limit);
}
