import type {
	MovieResultItem,
	TrendingAllResult,
	TVSeriesResultItem,
} from "@lorenzopant/tmdb";
import { getLocale } from "#/paraglide/runtime";

/**
 * One shape for cards and hero slides, so a movie rail and a trending rail can
 * share components. TMDB names the title and date fields differently per media
 * type, which is the only reason this normalisation exists.
 */
export type MediaItem = {
	id: number;
	mediaType: "movie" | "tv";
	title: string;
	overview: string;
	posterPath?: string;
	backdropPath?: string;
	/** `release_date` for movies, `first_air_date` for series. Often empty. */
	date: string;
	voteAverage: number;
	voteCount: number;
	genreIds: number[];
	originalLanguage: string;
};

export function fromMovie(movie: MovieResultItem): MediaItem {
	return {
		id: movie.id,
		mediaType: "movie",
		title: movie.title,
		overview: movie.overview,
		posterPath: movie.poster_path,
		backdropPath: movie.backdrop_path,
		date: movie.release_date,
		voteAverage: movie.vote_average,
		voteCount: movie.vote_count,
		genreIds: movie.genre_ids,
		originalLanguage: movie.original_language,
	};
}

export function fromTVSeries(series: TVSeriesResultItem): MediaItem {
	return {
		id: series.id,
		mediaType: "tv",
		title: series.name,
		overview: series.overview,
		posterPath: series.poster_path,
		backdropPath: series.backdrop_path,
		date: series.first_air_date,
		voteAverage: series.vote_average,
		voteCount: series.vote_count,
		genreIds: series.genre_ids,
		originalLanguage: series.original_language,
	};
}

/** Drops people — the home rails only show watchable things. */
export function fromTrending(results: TrendingAllResult[]): MediaItem[] {
	return results.flatMap((item) => {
		if (item.media_type === "movie") return [fromMovie(item)];
		if (item.media_type === "tv") return [fromTVSeries(item)];
		return [];
	});
}

export function releaseYear(date: string): string | null {
	const year = date?.slice(0, 4);
	return year && /^\d{4}$/.test(year) ? year : null;
}

/** Ratings arrive as 0-10 floats like 7.4285; one decimal is all a badge needs. */
export function formatRating(voteAverage: number): string {
	return voteAverage.toFixed(1);
}

export function formatVoteCount(voteCount: number): string {
	return new Intl.NumberFormat(getLocale(), { notation: "compact" }).format(
		voteCount,
	);
}

export function languageName(isoCode: string): string | null {
	if (!isoCode) return null;
	try {
		return (
			new Intl.DisplayNames([getLocale()], { type: "language" }).of(isoCode) ??
			null
		);
	} catch {
		return isoCode.toUpperCase();
	}
}

/**
 * Placeholder destination until the in-app record routes exist. Swap the
 * `<a>` in `MediaCard`/`HeroCarousel` for `<Link to="/movies/$movieId">` then.
 */
export function tmdbWebUrl(item: Pick<MediaItem, "id" | "mediaType">): string {
	return `https://www.themoviedb.org/${item.mediaType}/${item.id}`;
}
