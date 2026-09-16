import { createFileRoute } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/components/MediaRow";
import { getGenresQueryOptions } from "#/features/media/utils/genres";
import { getMediaListQueryOptions } from "#/features/media/utils/media-lists";
import { warmQuery } from "#/integrations/tanstack-query/warm-query";

/** One source for the loader and the render, so nothing ships as a skeleton. */
const RAILS = [
	{ title: "On the air", query: getMediaListQueryOptions("tv/on_the_air") },
	{ title: "Popular", query: getMediaListQueryOptions("tv/popular") },
	{ title: "Top rated", query: getMediaListQueryOptions("tv/top_rated") },
];

export const Route = createFileRoute("/_appLayout/tv-shows/")({
	loader: async ({ context }) => {
		const { queryClient } = context;

		await Promise.all([
			warmQuery(queryClient, getGenresQueryOptions()),
			...RAILS.map((rail) => warmQuery(queryClient, rail.query)),
		]);
	},
	component: TVShows,
});

function TVShows() {
	return (
		<main className="py-4 pb-8">
			<h1 className="px-4 text-2xl font-bold text-white sm:px-6 lg:px-8">
				TV Shows
			</h1>

			{RAILS.map((rail) => (
				<MediaRow key={rail.title} title={rail.title} query={rail.query} />
			))}
		</main>
	);
}
