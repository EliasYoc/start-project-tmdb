import {
	type ContentRating,
	type MovieReleaseDateResult,
	MovieReleaseType,
} from "@lorenzopant/tmdb";
import { minBy } from "es-toolkit";

/** One country's age rating, such as "PG-13" in the US or "B-15" in Mexico. */
export type AgeRating = {
	/** Written the way that country writes it: "TV-MA", "12A", "0". */
	rating: string;
	/** ISO 3166-1 code of the country that gave it. */
	region: string;
};

/**
 * Used when the viewer's country has no rating, which is common outside the
 * big markets: TMDB has US ratings for nearly every title.
 */
const FALLBACK_REGION = "US";

/**
 * The rating a cinema listing would show: the theatrical release first, then
 * limited, digital, physical and TV releases. Premieres come last because
 * festivals often screen a film before it is rated.
 */
const RELEASE_TYPE_PREFERENCE: number[] = [
	MovieReleaseType.Theatrical,
	MovieReleaseType.TheatricalLimited,
	MovieReleaseType.Digital,
	MovieReleaseType.Physical,
	MovieReleaseType.TV,
	MovieReleaseType.Premiere,
];

function releaseTypeRank(type: number): number {
	const rank = RELEASE_TYPE_PREFERENCE.indexOf(type);
	return rank === -1 ? RELEASE_TYPE_PREFERENCE.length : rank;
}

/** The viewer's country first, then the fallback; `null` when neither has one. */
function withFallback(
	ratingIn: (region: string) => string | null,
	region: string,
): AgeRating | null {
	for (const candidate of new Set([region, FALLBACK_REGION])) {
		const rating = ratingIn(candidate);
		if (rating) return { rating, region: candidate };
	}
	return null;
}

/**
 * A country lists one entry per release, and many have no rating: premieres,
 * re-releases, TV airings. Some ratings arrive with trailing spaces ("C ").
 */
export function pickMovieAgeRating(
	results: MovieReleaseDateResult[],
	region: string,
): AgeRating | null {
	return withFallback((candidate) => {
		const releases =
			results.find((result) => result.iso_3166_1 === candidate)
				?.release_dates ?? [];
		const rated = releases.filter((release) => release.certification.trim());
		const best = minBy(rated, (release) => releaseTypeRank(release.type));
		return best?.certification.trim() ?? null;
	}, region);
}

export function pickSeriesAgeRating(
	results: ContentRating[],
	region: string,
): AgeRating | null {
	return withFallback(
		(candidate) =>
			results
				.find((result) => result.iso_3166_1 === candidate)
				?.rating.trim() || null,
		region,
	);
}
