import type {
	Genre,
	MovieDetailsWithAppends,
	TVDetailsWithAppends,
	VideoItem,
} from "@lorenzopant/tmdb";
import { TMDBError } from "@lorenzopant/tmdb";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { MediaItem } from "#/features/media/cards-layouts/utils/media";
import { tmdb } from "#/integrations/tmdb/tmdb.server";

/**
 * One record shape for the movie and series screens, so both routes render the
 * same components. Only the fields that differ in meaning per media type
 * (runtime vs. seasons) are kept apart.
 */
export type MediaDetail = {
	id: number;
	mediaType: MediaItem["mediaType"];
	title: string;
	tagline: string;
	overview: string;
	posterPath?: string;
	backdropPath?: string;
	/** `release_date` for movies, `first_air_date` for series. Often empty. */
	date: string;
	voteAverage: number;
	voteCount: number;
	genres: Genre[];
	originalLanguage: string;
	/** Minutes. Movies only; series report seasons instead. */
	runtime: number | null;
	seasonCount: number | null;
	trailer: Trailer | null;
};

export type Trailer = { key: string; name: string };

/**
 * TMDB lists every clip it has, in no useful order. An official YouTube trailer
 * is the best match for the button; a teaser is an acceptable stand-in.
 */
function pickTrailer(videos: VideoItem[]): Trailer | null {
	const youtube = videos.filter((video) => video.site === "YouTube");
	const rank = (video: VideoItem) =>
		(video.type === "Trailer" ? 2 : video.type === "Teaser" ? 1 : 0) * 2 +
		(video.official ? 1 : 0);
	const [best] = youtube
		.filter((video) => rank(video) >= 2)
		.sort((a, b) => rank(b) - rank(a));
	return best ? { key: best.key, name: best.name } : null;
}

function fromMovieDetails(
	movie: MovieDetailsWithAppends<["videos"]>,
): MediaDetail {
	return {
		id: movie.id,
		mediaType: "movie",
		title: movie.title,
		tagline: movie.tagline ?? "",
		overview: movie.overview ?? "",
		posterPath: movie.poster_path,
		backdropPath: movie.backdrop_path,
		date: movie.release_date,
		voteAverage: movie.vote_average,
		voteCount: movie.vote_count,
		genres: movie.genres,
		originalLanguage: movie.original_language,
		// TMDB stores an unknown runtime as 0 rather than leaving it out.
		runtime: movie.runtime || null,
		seasonCount: null,
		trailer: pickTrailer(movie.videos.results),
	};
}

function fromTVSeriesDetails(
	series: TVDetailsWithAppends<["videos"]>,
): MediaDetail {
	return {
		id: series.id,
		mediaType: "tv",
		title: series.name,
		tagline: series.tagline ?? "",
		overview: series.overview ?? "",
		posterPath: series.poster_path,
		backdropPath: series.backdrop_path,
		date: series.first_air_date,
		voteAverage: series.vote_average,
		voteCount: series.vote_count,
		genres: series.genres,
		originalLanguage: series.original_language,
		runtime: null,
		seasonCount: series.number_of_seasons || null,
		trailer: pickTrailer(series.videos.results),
	};
}

/** A stale or mistyped id is a missing record, not a server failure. */
function nullIfNotFound(error: unknown): null {
	if (error instanceof TMDBError && error.http_status_code === 404) return null;
	throw error;
}

const mediaIdSchema = z.number().int().positive();

const fetchMovieDetail = createServerFn()
	.validator(mediaIdSchema)
	.handler(async ({ data: movieId }): Promise<MediaDetail | null> => {
		try {
			const movie = await tmdb.movies.details({
				movie_id: movieId,
				append_to_response: ["videos"] as const,
			});
			return fromMovieDetails(movie);
		} catch (error) {
			return nullIfNotFound(error);
		}
	});

const fetchTVSeriesDetail = createServerFn()
	.validator(mediaIdSchema)
	.handler(async ({ data: seriesId }): Promise<MediaDetail | null> => {
		try {
			const series = await tmdb.tv_series.details({
				series_id: seriesId,
				append_to_response: ["videos"] as const,
			});
			return fromTVSeriesDetails(series);
		} catch (error) {
			return nullIfNotFound(error);
		}
	});

export const getMovieDetailQueryOptions = (movieId: number) =>
	queryOptions({
		queryKey: ["media-detail", "movie", movieId],
		queryFn: () => fetchMovieDetail({ data: movieId }),
		staleTime: 1000 * 60 * 30,
	});

export const getTVSeriesDetailQueryOptions = (seriesId: number) =>
	queryOptions({
		queryKey: ["media-detail", "tv", seriesId],
		queryFn: () => fetchTVSeriesDetail({ data: seriesId }),
		staleTime: 1000 * 60 * 30,
	});

/** Path params arrive as strings; anything that is not a TMDB id is a 404. */
export function parseMediaId(param: string): number | null {
	const result = mediaIdSchema.safeParse(Number(param));
	return result.success ? result.data : null;
}

export function formatRuntime(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	if (hours === 0) return `${rest} min`;
	return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

export function formatSeasons(count: number): string {
	return count === 1 ? "1 season" : `${count} seasons`;
}
