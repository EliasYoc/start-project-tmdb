import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { MediaItem } from "#/features/media/utils/media";
import { fromMovie } from "#/features/media/utils/media";
import { tmdb } from "#/integrations/tmdb/tmdb.server";

export const searchQuerySchema = z.string().trim().min(1).max(200);

const searchMovies = createServerFn()
	.validator(searchQuerySchema)
	.handler(async ({ data: query }): Promise<MediaItem[]> => {
		const res = await tmdb.search.movies({ query });
		return res.results.map(fromMovie);
	});

export const getSearchMoviesQueryOptions = (query: string) =>
	queryOptions({
		queryKey: ["search-movies", query],
		queryFn: () => searchMovies({ data: query }),
		staleTime: 1000 * 60 * 5,
	});
