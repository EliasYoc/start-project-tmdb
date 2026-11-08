import type {
	Genre,
	MovieAppendToResponseNamespace,
	MovieDetailsWithAppends,
	TVAppendToResponseNamespace,
	TVDetailsWithAppends,
	VideoItem,
} from "@lorenzopant/tmdb";
import { TMDBError } from "@lorenzopant/tmdb";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { compact, maxBy } from "es-toolkit";
import { z } from "zod";
import {
	fromMovie,
	fromTVSeries,
	languageName,
	type MediaItem,
	releaseYear,
} from "#/features/media/cards-layouts/utils/media";
import { tmdb } from "#/integrations/tmdb/tmdb.server";
import {
	type AgeRating,
	pickMovieAgeRating,
	pickSeriesAgeRating,
} from "./age-rating";
import {
	fromMovieCredits,
	fromTVAggregateCredits,
	type MediaCredits,
} from "./media-credits";
import { fromTVSeasons, type SeriesSeasons } from "./series-seasons";
import {
	pickWatchAvailability,
	regionFromAcceptLanguage,
	type WatchAvailability,
} from "./watch-providers";

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
	/** In the viewer's country, or the US one when theirs has none. */
	ageRating: AgeRating | null;
	trailer: Trailer | null;
	credits: MediaCredits;
	/**
	 * TMDB's recommendations, as cards. Picked over `similar`, which only matches
	 * genres and keywords and comes back empty for many lesser-known titles.
	 */
	related: MediaItem[];
	watch: WatchAvailability;
	/** Seasons and what airs next. `null` for movies. */
	series: SeriesSeasons | null;
};

export type Trailer = { key: string; name: string };

/**
 * Appended to the details request so the whole screen costs one TMDB call.
 * Series use `aggregate_credits`: plain `credits` only covers the last season.
 * `satisfies` instead of `as const`: the client wants a mutable array.
 */
const MOVIE_APPENDS = [
	"videos",
	"credits",
	"recommendations",
	"watch/providers",
	"release_dates",
] satisfies MovieAppendToResponseNamespace[];
const TV_APPENDS = [
	"videos",
	"aggregate_credits",
	"recommendations",
	"watch/providers",
	"content_ratings",
] satisfies TVAppendToResponseNamespace[];

/**
 * TMDB lists every clip it has, in no useful order. An official YouTube trailer
 * is the best match for the button; a teaser is an acceptable stand-in.
 */
function pickTrailer(videos: VideoItem[]): Trailer | null {
	const youtube = videos.filter((video) => video.site === "YouTube");
	const rank = (video: VideoItem) =>
		(video.type === "Trailer" ? 2 : video.type === "Teaser" ? 1 : 0) * 2 +
		(video.official ? 1 : 0);
	const best = maxBy(
		youtube.filter((video) => rank(video) >= 2),
		rank,
	);
	return best ? { key: best.key, name: best.name } : null;
}

function fromMovieDetails(
	movie: MovieDetailsWithAppends<typeof MOVIE_APPENDS>,
	region: string,
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
		ageRating: pickMovieAgeRating(movie.release_dates.results, region),
		trailer: pickTrailer(movie.videos.results),
		credits: fromMovieCredits(movie.credits),
		related: movie.recommendations.results.map(fromMovie),
		watch: pickWatchAvailability(movie["watch/providers"].results, region),
		series: null,
	};
}

function fromTVSeriesDetails(
	series: TVDetailsWithAppends<typeof TV_APPENDS>,
	region: string,
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
		ageRating: pickSeriesAgeRating(series.content_ratings.results, region),
		trailer: pickTrailer(series.videos.results),
		credits: fromTVAggregateCredits(
			series.aggregate_credits,
			series.created_by,
		),
		related: series.recommendations.results.map(fromTVSeries),
		watch: pickWatchAvailability(series["watch/providers"].results, region),
		series: fromTVSeasons(series),
	};
}

/**
 * Read inside the handler: during SSR that is the page request, and on client
 * navigation it is the browser's call to the server function, so both send
 * the same header.
 */
function viewerRegion(): string {
	return regionFromAcceptLanguage(getRequestHeader("accept-language"));
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
				append_to_response: MOVIE_APPENDS,
			});
			return fromMovieDetails(movie, viewerRegion());
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
				append_to_response: TV_APPENDS,
			});
			return fromTVSeriesDetails(series, viewerRegion());
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

/**
 * `data-scroll-restoration-id` for a rail on this page. Without it TanStack
 * Router matches scrolled elements by DOM position and carries them over, so
 * the next title's rail would open where the last one was left. With a
 * per-title id each rail starts at the beginning, and Back still returns to
 * where it was.
 */
export function railScrollId(
	detail: Pick<MediaDetail, "mediaType" | "id">,
	rail: string,
): string {
	return `${detail.mediaType}-${detail.id}-${rail}`;
}

/** Length, language and year, skipping whatever TMDB left empty. */
export function mediaDetailMeta(detail: MediaDetail): string[] {
	return compact([
		detail.runtime ? formatRuntime(detail.runtime) : null,
		detail.seasonCount ? formatSeasons(detail.seasonCount) : null,
		languageName(detail.originalLanguage),
		releaseYear(detail.date),
	]);
}
