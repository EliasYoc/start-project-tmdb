import { createFileRoute, notFound } from "@tanstack/react-router";
import { CastAndCrew } from "#/features/media/detail/components/CastAndCrew";
import { MediaDetailHero } from "#/features/media/detail/components/MediaDetailHero";
import { MediaDetailNotFound } from "#/features/media/detail/components/MediaDetailNotFound";
import { MediaDetailSkeleton } from "#/features/media/detail/components/MediaDetailSkeleton";
import { RelatedTitles } from "#/features/media/detail/components/RelatedTitles";
import {
	getMovieDetailQueryOptions,
	parseMediaId,
} from "#/features/media/detail/utils/media-detail";

export const Route = createFileRoute("/_appLayout/movies/$movieId")({
	// "More like this" links from one movie to another on this same route. A
	// fresh mount starts the next page collapsed and its rails at the start.
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

function MovieDetail() {
	const movie = Route.useLoaderData();
	return (
		<>
			<MediaDetailHero detail={movie} />
			<CastAndCrew detail={movie} />
			<RelatedTitles detail={movie} />
		</>
	);
}
