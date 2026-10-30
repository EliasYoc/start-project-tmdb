import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	MediaDetailHero,
	MediaDetailNotFound,
	MediaDetailSkeleton,
} from "#/features/media/detail/components/MediaDetailHero";
import {
	getTVSeriesDetailQueryOptions,
	parseMediaId,
} from "#/features/media/detail/utils/media-detail";

export const Route = createFileRoute("/_appLayout/tv-shows/$seriesId")({
	loader: async ({ params, context: { queryClient } }) => {
		const seriesId = parseMediaId(params.seriesId);
		if (seriesId === null) throw notFound();

		const series = await queryClient.ensureQueryData(
			getTVSeriesDetailQueryOptions(seriesId),
		);
		if (!series) throw notFound();
		return series;
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [{ title: loaderData.title }] : [],
	}),
	component: SeriesDetail,
	pendingComponent: MediaDetailSkeleton,
	notFoundComponent: () => <MediaDetailNotFound mediaType="tv" />,
});

function SeriesDetail() {
	const series = Route.useLoaderData();
	return <MediaDetailHero detail={series} />;
}
