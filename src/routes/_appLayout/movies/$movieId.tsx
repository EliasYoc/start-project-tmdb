import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	MediaDetailHero,
	MediaDetailNotFound,
	MediaDetailSkeleton,
} from "#/features/media/detail/components/MediaDetailHero";
import {
	getMovieDetailQueryOptions,
	parseMediaId,
} from "#/features/media/detail/utils/media-detail";

export const Route = createFileRoute("/_appLayout/movies/$movieId")({
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
	return <MediaDetailHero detail={movie} />;
}
