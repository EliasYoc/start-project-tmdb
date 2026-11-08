import { Badge, Text } from "@mantine/core";
import {
	formatAirDate,
	type UpcomingEpisode,
} from "../../../../utils/series-seasons";

const MILESTONES: Record<NonNullable<UpcomingEpisode["milestone"]>, string> = {
	premiere: "Season premiere",
	finale: "Season finale",
};

/**
 * The episode's title leads, falling back to its number while TMDB has none.
 * Season, episode and date share the line below; the date is left out when
 * TMDB has not set one.
 */
export function NextEpisode({ episode }: { episode: UpcomingEpisode }) {
	const date = formatAirDate(episode.airDate);

	return (
		<div className="rounded-xl bg-(--mantine-color-dark-6) p-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<Text component="h3" size="xs" fw={600} tt="uppercase" c="dimmed">
					Next episode
				</Text>
				{episode.milestone && (
					<Badge variant="light" color="brand" size="sm" radius="sm">
						{MILESTONES[episode.milestone]}
					</Badge>
				)}
			</div>
			<Text fw={600} mt={4} lineClamp={2}>
				{episode.name || `Episode ${episode.episodeNumber}`}
			</Text>
			<Text size="sm" c="dimmed" mt={2}>
				Season {episode.seasonNumber} · Episode {episode.episodeNumber}
				{date && (
					<>
						{" · "}
						<time dateTime={episode.airDate}>{date}</time>
					</>
				)}
			</Text>
		</div>
	);
}
