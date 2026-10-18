import { createFileRoute } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { getTrendingQueryOptions } from "#/features/media/cards-layouts/utils/trending";

export const Route = createFileRoute("/_appLayout/movies/")({
	component: Movies,
});
function Movies() {
	return (
		<>
			<MediaRow
				title="Trending Movies"
				query={getTrendingQueryOptions("movies")}
			/>
		</>
	);
}
