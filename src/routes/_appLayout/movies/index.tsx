import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MediaCard, MediaCardSkeleton } from "#/components/MediaCard";
import { MediaRow } from "#/features/media/components/MediaRow";
import { getGenresQueryOptions } from "#/features/media/utils/genres";
import { getMediaListQueryOptions } from "#/features/media/utils/media-lists";
import { getInTheatresMoviesQueryOptions } from "#/features/movies/movie-list/utils/in-theatres-movies";
import { getSearchMoviesQueryOptions } from "#/features/movies/movie-list/utils/search-movies";
import { warmQuery } from "#/integrations/tanstack-query/warm-query";

const moviesSearchSchema = z.object({
	/** Set by the header search field. Absent means "just browse". */
	q: z.string().trim().min(1).max(200).optional().catch(undefined),
});

export const Route = createFileRoute("/_appLayout/movies/")({
	validateSearch: moviesSearchSchema,
	loaderDeps: ({ search }) => ({ q: search.q }),
	loader: async ({ context, deps }) => {
		const { queryClient } = context;

		await Promise.all([
			warmQuery(queryClient, getGenresQueryOptions()),
			deps.q
				? warmQuery(queryClient, getSearchMoviesQueryOptions(deps.q))
				: Promise.resolve(),
		]);
	},
	component: Movies,
});

function Movies() {
	const { q } = Route.useSearch();

	return (
		<main className="py-4 pb-8">
			{q ? (
				<SearchResults query={q} />
			) : (
				<>
					<h1 className="px-4 text-2xl font-bold text-white sm:px-6 lg:px-8">
						Movies
					</h1>
					<MediaRow
						title="In theatres"
						query={getInTheatresMoviesQueryOptions()}
					/>
					<MediaRow
						title="Popular"
						query={getMediaListQueryOptions("movie/popular")}
					/>
					<MediaRow
						title="Top rated"
						query={getMediaListQueryOptions("movie/top_rated")}
					/>
					<MediaRow
						title="Coming soon"
						query={getMediaListQueryOptions("movie/upcoming")}
					/>
				</>
			)}
		</main>
	);
}

function SearchResults({ query }: { query: string }) {
	const {
		data: results,
		isPending,
		isError,
	} = useQuery(getSearchMoviesQueryOptions(query));
	const { data: genres } = useQuery(getGenresQueryOptions());

	return (
		<section className="px-4 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold text-white">
				Results for <span className="text-brand-400">{query}</span>
			</h1>

			{isError && (
				<p className="mt-6 text-sm text-neutral-400">
					The search could not be completed. Try again in a moment.
				</p>
			)}

			{!isError && !isPending && results.length === 0 && (
				<p className="mt-6 text-sm text-neutral-400">
					No movies matched that title.
				</p>
			)}

			<div className="mt-6 flex flex-wrap gap-4">
				{isPending
					? Array.from({ length: 8 }, (_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder list
							<MediaCardSkeleton key={index} />
						))
					: results?.map((item) => (
							<MediaCard key={item.id} item={item} genres={genres} />
						))}
			</div>
		</section>
	);
}
