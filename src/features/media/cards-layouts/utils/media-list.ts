import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { tmdb } from "#/integrations/tmdb/tmdb.server";
import type { MediaItem } from "./media";
import { fromMovie, fromTVSeries } from "./media";

/**
 * The TMDB curated lists the home rails are built from. One server function for
 * all of them keeps the round-trip shape identical and the cache keys uniform.
 */
export const mediaListSchema = z.enum([
	"movie/now_playing",
	"movie/popular",
	"movie/top_rated",
	"movie/upcoming",
	"tv/on_the_air",
	"tv/popular",
	"tv/top_rated",
]);

export type MediaList = z.infer<typeof mediaListSchema>;

const fetchMediaList = createServerFn()
	.validator(mediaListSchema)
	.handler(async ({ data: list }): Promise<MediaItem[]> => {
		switch (list) {
			case "movie/now_playing":
				return (await tmdb.movie_lists.now_playing()).results.map(fromMovie);
			case "movie/popular":
				return (await tmdb.movie_lists.popular()).results.map(fromMovie);
			case "movie/top_rated":
				return (await tmdb.movie_lists.top_rated()).results.map(fromMovie);
			case "movie/upcoming":
				return (await tmdb.movie_lists.upcoming()).results.map(fromMovie);
			case "tv/on_the_air":
				return (await tmdb.tv_lists.on_the_air()).results.map(fromTVSeries);
			case "tv/popular":
				return (await tmdb.tv_lists.popular()).results.map(fromTVSeries);
			case "tv/top_rated":
				return (await tmdb.tv_lists.top_rated()).results.map(fromTVSeries);
		}
	});

export const getMediaListQueryOptions = (list: MediaList) =>
	queryOptions({
		queryKey: ["media-list", list],
		queryFn: () => fetchMediaList({ data: list }),
		staleTime: 1000 * 60 * 30,
	});

export type MediaListQueryOptions = ReturnType<typeof getMediaListQueryOptions>;
