import type {
	TVEpisodeItem,
	TVSeasonItem,
	TVSeriesDetails,
} from "@lorenzopant/tmdb";
import { compact, partition } from "es-toolkit";
import { releaseYear } from "#/features/media/cards-layouts/utils/media";
import { getLocale } from "#/paraglide/runtime";
import { formatEpisodes } from "./media-credits";

export type Season = {
	id: number;
	name: string;
	posterPath?: string;
	/** `YYYY-MM-DD`. Empty for specials and announced seasons with no date. */
	airDate: string;
	/** 0 for a season TMDB has announced but lists no episodes for yet. */
	episodeCount: number;
};

export type UpcomingEpisode = {
	seasonNumber: number;
	episodeNumber: number;
	/** Empty when TMDB has no title for it yet. */
	name: string;
	/** `YYYY-MM-DD`. */
	airDate: string;
	/** Flagged because it changes when someone may want to start watching. */
	milestone: "premiere" | "finale" | null;
};

/**
 * Series only. Without a next episode, `status` says why: the series is over,
 * or it goes on with no date yet.
 */
export type SeriesSeasons = {
	/** In season order, with the specials (season 0) moved to the end. */
	seasons: Season[];
	nextEpisode: UpcomingEpisode | null;
	status: "ended" | "canceled" | "ongoing";
	/** Year of the last aired episode. */
	lastAirYear: string | null;
};

function fromSeason(season: TVSeasonItem): Season {
	return {
		id: season.id,
		name: season.name,
		posterPath: season.poster_path,
		airDate: season.air_date ?? "",
		episodeCount: season.episode_count,
	};
}

function fromNextEpisode(episode: TVEpisodeItem): UpcomingEpisode {
	return {
		seasonNumber: episode.season_number,
		episodeNumber: episode.episode_number,
		name: episode.name,
		airDate: episode.air_date ?? "",
		milestone:
			episode.episode_type === "finale"
				? "finale"
				: episode.episode_number === 1
					? "premiere"
					: null,
	};
}

/** TMDB's free-text status, narrowed to what the page says about it. */
function seriesStatus(status: string | undefined): SeriesSeasons["status"] {
	if (status === "Ended") return "ended";
	if (status === "Canceled") return "canceled";
	return "ongoing";
}

/**
 * Specials go last: they are extras, sometimes hundreds of featurettes, and
 * starting the rail with them would hide the actual first season.
 */
export function fromTVSeasons(
	series: Pick<
		TVSeriesDetails,
		"seasons" | "next_episode_to_air" | "status" | "last_air_date"
	>,
): SeriesSeasons {
	const [specials, numbered] = partition(
		series.seasons ?? [],
		(season) => season.season_number === 0,
	);
	return {
		seasons: [...numbered, ...specials].map(fromSeason),
		nextEpisode: series.next_episode_to_air
			? fromNextEpisode(series.next_episode_to_air)
			: null,
		status: seriesStatus(series.status),
		lastAirYear: releaseYear(series.last_air_date),
	};
}

/** Year and episode count; "Announced" while TMDB lists no episodes. */
export function seasonMeta(season: Season): string[] {
	return compact([
		releaseYear(season.airDate),
		season.episodeCount > 0 ? formatEpisodes(season.episodeCount) : "Announced",
	]);
}

/** Said instead of the next episode when there is none. */
export function noNextEpisodeNote({
	status,
	lastAirYear,
}: SeriesSeasons): string {
	if (status === "ended") {
		return lastAirYear
			? `The series ended in ${lastAirYear}.`
			: "The series has ended.";
	}
	if (status === "canceled") {
		return lastAirYear
			? `The series was canceled. Its last episode aired in ${lastAirYear}.`
			: "The series was canceled.";
	}
	return "No next episode is scheduled yet.";
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * TMDB air dates are calendar days with no time zone. Formatting them in UTC
 * keeps the day from shifting back by one west of Greenwich, and gives the
 * server and the browser the same text.
 */
export function formatAirDate(date: string): string | null {
	if (!DATE_ONLY.test(date)) return null;
	return new Intl.DateTimeFormat(getLocale(), {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(`${date}T00:00:00Z`));
}
