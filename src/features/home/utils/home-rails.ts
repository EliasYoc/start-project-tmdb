import type { MediaListQueryOptions } from "#/features/media/utils/media-lists";
import { getMediaListQueryOptions } from "#/features/media/utils/media-lists";
import type { TrendingCategory } from "#/features/media/utils/trending";
import { getInTheatresMoviesQueryOptions } from "#/features/movies/movie-list/utils/in-theatres-movies";

export type HomeRail = {
	title: string;
	query: MediaListQueryOptions;
};

/**
 * The rails under the hero follow the selected category, so a TV tab never
 * hands back a shelf of films.
 */
export function homeRailsFor(category: TrendingCategory): HomeRail[] {
	if (category === "tv") {
		return [
			{ title: "On the air", query: getMediaListQueryOptions("tv/on_the_air") },
			{
				title: "Top rated series",
				query: getMediaListQueryOptions("tv/top_rated"),
			},
		];
	}

	if (category === "movies") {
		return [
			{ title: "In theatres", query: getInTheatresMoviesQueryOptions() },
			{
				title: "Top rated movies",
				query: getMediaListQueryOptions("movie/top_rated"),
			},
		];
	}

	return [
		{ title: "In theatres", query: getInTheatresMoviesQueryOptions() },
		{ title: "Popular series", query: getMediaListQueryOptions("tv/popular") },
	];
}
