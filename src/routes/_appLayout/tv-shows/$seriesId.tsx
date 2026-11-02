import { createFileRoute, notFound } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { CastAndCrew } from "#/features/media/detail/components/CastAndCrew";
import { MediaDetailHero } from "#/features/media/detail/components/MediaDetailHero";
import { MediaDetailNotFound } from "#/features/media/detail/components/MediaDetailNotFound";
import { MediaDetailSkeleton } from "#/features/media/detail/components/MediaDetailSkeleton";
import {
	getTVSeriesDetailQueryOptions,
	parseMediaId,
} from "#/features/media/detail/utils/media-detail";

export const Route = createFileRoute("/_appLayout/tv-shows/$seriesId")({
	// "More like this" links from one series to another on this same route. A
	// fresh mount starts the next page collapsed and its rails at the start.
	remountDeps: ({ params }) => params,
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
	return (
		<>
			<MediaDetailHero detail={series} />
			<CastAndCrew detail={series} />
			<MediaRow title="More like this" items={series.related} />
		</>
	);
}
