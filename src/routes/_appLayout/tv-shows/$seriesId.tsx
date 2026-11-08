import { Container } from "@mantine/core";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { CastAndCrew } from "#/features/media/detail/components/CastAndCrew";
import { MediaDetailHero } from "#/features/media/detail/components/MediaDetailHero";
import { MediaDetailNotFound } from "#/features/media/detail/components/MediaDetailNotFound";
import { MediaDetailSkeleton } from "#/features/media/detail/components/MediaDetailSkeleton";
import { Seasons } from "#/features/media/detail/components/Seasons";
import { WhereToWatch } from "#/features/media/detail/components/WhereToWatch";
import {
	getTVSeriesDetailQueryOptions,
	parseMediaId,
	railScrollId,
} from "#/features/media/detail/utils/media-detail";

export const Route = createFileRoute("/_appLayout/tv-shows/$seriesId")({
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

/**
 * Mounted fresh for each series (`remountDeps`): "More like this" stays on this
 * route, and the next series must not inherit an expanded synopsis.
 */
function SeriesDetail() {
	const series = Route.useLoaderData();
	return (
		<>
			<MediaDetailHero detail={series} />
			<Container size="lg" px={0} className="space-y-6">
				<WhereToWatch watch={series.watch} />
				<Seasons detail={series} />
				<CastAndCrew detail={series} />
				<MediaRow
					title="More like this"
					items={series.related}
					scrollRestorationId={railScrollId(series, "related")}
				/>
			</Container>
		</>
	);
}
