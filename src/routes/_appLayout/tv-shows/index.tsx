import { createFileRoute } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { getTrendingQueryOptions } from "#/features/media/cards-layouts/utils/trending";

export const Route = createFileRoute("/_appLayout/tv-shows/")({
	component: TvShows,
});

function TvShows() {
	return (
		<>
			<MediaRow
				title="Trending TV Shows"
				query={getTrendingQueryOptions("tv")}
			/>
		</>
	);
}
