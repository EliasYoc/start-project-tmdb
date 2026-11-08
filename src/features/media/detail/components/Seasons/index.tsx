import { Text } from "@mantine/core";
import { useRef } from "react";
import { RailScrollButtons } from "#/features/media/cards-layouts/components/RailScrollButtons";
import { type MediaDetail, railScrollId } from "../../utils/media-detail";
import { noNextEpisodeNote } from "../../utils/series-seasons";
import { DetailSection } from "../DetailSection";
import { NextEpisode } from "./components/NextEpisode";
import { SeasonList } from "./components/SeasonList";

/**
 * Series only; renders nothing for a movie. What airs next comes first because
 * it changes week to week. Without a next episode, one line says whether the
 * series is over or still waiting for a date, which most series are.
 */
export function Seasons({ detail }: { detail: MediaDetail }) {
	const listRef = useRef<HTMLUListElement>(null);
	const { series } = detail;
	if (!series) return null;

	const hasSeasons = series.seasons.length > 0;

	return (
		<DetailSection
			title="Seasons"
			action={
				hasSeasons && (
					<RailScrollButtons scrollerRef={listRef} title="Seasons" />
				)
			}
		>
			<div>
				{series.nextEpisode ? (
					<NextEpisode episode={series.nextEpisode} />
				) : (
					<Text size="sm" c="dimmed">
						{noNextEpisodeNote(series)}
					</Text>
				)}
			</div>
			{hasSeasons && (
				<SeasonList
					ref={listRef}
					seasons={series.seasons}
					seriesTitle={detail.title}
					scrollRestorationId={railScrollId(detail, "seasons")}
				/>
			)}
		</DetailSection>
	);
}
