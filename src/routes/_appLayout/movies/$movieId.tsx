import { Container } from "@mantine/core";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { CastAndCrew } from "#/features/media/detail/components/CastAndCrew";
import { MediaDetailHero } from "#/features/media/detail/components/MediaDetailHero";
import { MediaDetailNotFound } from "#/features/media/detail/components/MediaDetailNotFound";
import { MediaDetailSkeleton } from "#/features/media/detail/components/MediaDetailSkeleton";
import { WhereToWatch } from "#/features/media/detail/components/WhereToWatch";

import {
	getMovieDetailQueryOptions,
	parseMediaId,
	railScrollId,
} from "#/features/media/detail/utils/media-detail";

export const Route = createFileRoute("/_appLayout/movies/$movieId")({
	remountDeps: ({ params }) => params,
	loader: async ({ params, context: { queryClient } }) => {
		const movieId = parseMediaId(params.movieId);
		if (movieId === null) throw notFound();

		const movie = await queryClient.ensureQueryData(
			getMovieDetailQueryOptions(movieId),
		);
		if (!movie) throw notFound();
		return movie;
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: loaderData.title }] : [],
	}),
	component: MovieDetail,
	pendingComponent: MediaDetailSkeleton,
	notFoundComponent: () => <MediaDetailNotFound mediaType="movie" />,
});

/**
 * Mounted fresh for each movie (`remountDeps`): "More like this" stays on this
 * route, and the next movie must not inherit an expanded synopsis.
 */
function MovieDetail() {
	const movie = Route.useLoaderData();
	return (
		<>
			<MediaDetailHero detail={movie} />
			<Container size="lg" px={0} className="space-y-6">
				<WhereToWatch watch={movie.watch} />
				<CastAndCrew detail={movie} />
				<MediaRow
					title="More like this"
					items={movie.related}
					scrollRestorationId={railScrollId(movie, "related")}
				/>
			</Container>
		</>
	);
}
