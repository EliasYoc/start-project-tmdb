import type {
	MovieCredits,
	TVAggregateCredits,
	TVSeriesDetails,
} from "@lorenzopant/tmdb";
import { compact, groupBy, sortBy, uniq } from "es-toolkit";

/**
 * Cast and crew trimmed to what the detail screen shows. TMDB returns every
 * credited person (hundreds on a long series), so the lists are cut on the
 * server and only the top of each one reaches the client.
 */
export type MediaCredits = {
	cast: CastMember[];
	crew: CrewMember[];
};

export type CastMember = {
	/** TMDB person id, for the future person page. */
	id: number;
	name: string;
	profilePath?: string;
	/** Often empty on smaller titles. */
	character: string;
	/** Series only: episodes across every season. */
	episodeCount: number | null;
};

export type CrewMember = {
	id: number;
	name: string;
	profilePath?: string;
	/** Display labels, most important first: one person can direct and write. */
	jobs: string[];
};

const MAX_CAST = 12;
const MAX_CREW = 8;

/**
 * The jobs worth surfacing, in priority order, with a shorter label where
 * TMDB's own name is long. Everything else (producers, editors, grips) is left
 * out: the full crew list belongs on its own page.
 */
const FEATURED_JOBS = [
	{ job: "Creator", label: "Creator" },
	{ job: "Director", label: "Director" },
	{ job: "Screenplay", label: "Screenplay" },
	{ job: "Writer", label: "Writer" },
	{ job: "Story", label: "Story" },
	{ job: "Novel", label: "Novel" },
	{ job: "Original Music Composer", label: "Music" },
	{ job: "Director of Photography", label: "Cinematography" },
];

const CREATOR_RANK = 0;

type CrewCredit = {
	id: number;
	name: string;
	profilePath?: string;
	job: string;
	episodeCount: number;
};

function featuredCrew(credits: CrewCredit[]): CrewMember[] {
	const ranked = credits
		.map((credit) => ({
			...credit,
			rank: FEATURED_JOBS.findIndex(({ job }) => job === credit.job),
		}))
		.filter((credit) => credit.rank !== -1);

	const people = Object.values(groupBy(ranked, (credit) => credit.id)).map(
		(personCredits) => {
			const byRank = sortBy(personCredits, ["rank"]);
			const [top] = byRank;
			return {
				id: top.id,
				name: top.name,
				profilePath: top.profilePath,
				jobs: uniq(byRank.map(({ rank }) => FEATURED_JOBS[rank].label)),
				rank: top.rank,
				episodeCount: Math.max(...byRank.map((c) => c.episodeCount)),
			};
		},
	);

	// Creators lead. After them, whoever worked on the most episodes; movies
	// have no episode counts, so their order falls through to the job ranking.
	return sortBy(people, [
		(person) => (person.rank === CREATOR_RANK ? 0 : 1),
		(person) => -person.episodeCount,
		"rank",
	])
		.slice(0, MAX_CREW)
		.map(({ id, name, profilePath, jobs }) => ({
			id,
			name,
			profilePath,
			jobs,
		}));
}

export function fromMovieCredits(credits: MovieCredits): MediaCredits {
	return {
		// TMDB already sorts movie cast by billing order.
		cast: credits.cast.slice(0, MAX_CAST).map((person) => ({
			id: person.id,
			name: person.name,
			profilePath: person.profile_path,
			character: person.character,
			episodeCount: null,
		})),
		crew: featuredCrew(
			credits.crew.map((person) => ({
				id: person.id,
				name: person.name,
				profilePath: person.profile_path,
				job: person.job,
				episodeCount: 0,
			})),
		),
	};
}

/**
 * Uses `aggregate_credits` rather than `credits`, which on a series only covers
 * the latest season. Creators are not crew in TMDB's model; they come from the
 * series details and are folded in so they lead the crew list.
 */
export function fromTVAggregateCredits(
	credits: TVAggregateCredits,
	createdBy: TVSeriesDetails["created_by"],
): MediaCredits {
	return {
		// Aggregate cast arrives sorted by episode count, the main cast first.
		cast: credits.cast.slice(0, MAX_CAST).map((person) => ({
			id: person.id,
			name: person.name,
			profilePath: person.profile_path,
			// An actor can play several characters; the two biggest are enough.
			character: compact(
				uniq(
					sortBy(person.roles, [(role) => -role.episode_count]).map(
						(role) => role.character,
					),
				),
			)
				.slice(0, 2)
				.join(" / "),
			episodeCount: person.total_episode_count,
		})),
		crew: featuredCrew([
			...createdBy.map((person) => ({
				id: person.id,
				name: person.name,
				profilePath: person.profile_path,
				job: "Creator",
				episodeCount: 0,
			})),
			...credits.crew.flatMap((person) =>
				person.jobs.map((job) => ({
					id: person.id,
					name: person.name,
					profilePath: person.profile_path,
					job: job.job,
					episodeCount: job.episode_count,
				})),
			),
		]),
	};
}

export function formatEpisodes(count: number): string {
	return count === 1 ? "1 episode" : `${count} episodes`;
}
