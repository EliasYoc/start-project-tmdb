import { createFileRoute } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/components/MediaRow";
import { getGenresQueryOptions } from "#/features/media/utils/genres";
import { getMediaListQueryOptions } from "#/features/media/utils/media-lists";
import { warmQuery } from "#/integrations/tanstack-query/warm-query";

export const Route = createFileRoute("/_appLayout/tv-shows/")({
	loader: ({ context }) =>
		warmQuery(context.queryClient, getGenresQueryOptions()),
	component: TVShows,
});

function TVShows() {
	return (
		<main className="py-4 pb-8">
			<h1 className="px-4 text-2xl font-bold text-white sm:px-6 lg:px-8">
				TV Shows
			</h1>
			<MediaRow
				title="On the air"
				query={getMediaListQueryOptions("tv/on_the_air")}
			/>
			<MediaRow
				title="Popular"
				query={getMediaListQueryOptions("tv/popular")}
			/>
			<MediaRow
				title="Top rated"
				query={getMediaListQueryOptions("tv/top_rated")}
			/>
		</main>
	);
}
