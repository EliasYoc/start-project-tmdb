import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { tmdb } from "#/integrations/tmdb/tmdb.server";
import type { MediaItem } from "./media";
import { fromMovie, fromTrending, fromTVSeries } from "./media";

/** The home category tabs. Lives in the URL, so it is validated on both ends. */
export const trendingCategorySchema = z
	.enum(["all", "movies", "tv"])
	.catch("all");

export type TrendingCategory = z.infer<typeof trendingCategorySchema>;

export const DEFAULT_CATEGORY: TrendingCategory = "all";

export const TRENDING_CATEGORIES = [
	{ value: "all", label: "All" },
	{ value: "movies", label: "Movies" },
	{ value: "tv", label: "TV" },
] as const satisfies readonly { value: TrendingCategory; label: string }[];

const fetchTrending = createServerFn()
	.validator(trendingCategorySchema)
	.handler(async ({ data: category }): Promise<MediaItem[]> => {
		const time_window = "week" as const;

		if (category === "movies") {
			const res = await tmdb.trending.movies({ time_window });
			return res.results.map(fromMovie);
		}

		if (category === "tv") {
			const res = await tmdb.trending.tv({ time_window });
			return res.results.map(fromTVSeries);
		}

		const res = await tmdb.trending.all({ time_window });
		return fromTrending(res.results);
	});

export const getTrendingQueryOptions = (category: TrendingCategory) =>
	queryOptions({
		queryKey: ["trending", category],
		queryFn: () => fetchTrending({ data: category }),
		staleTime: 1000 * 60 * 30,
	});
