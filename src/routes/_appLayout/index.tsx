import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { CategoryTabs } from "#/features/home/components/CategoryTabs";
import { HeroCarousel } from "#/features/home/components/HeroCarousel";
import { homeRailsFor } from "#/features/home/utils/home-rails";
import { MediaRow } from "#/features/media/components/MediaRow";
import { getGenresQueryOptions } from "#/features/media/utils/genres";
import {
	DEFAULT_CATEGORY,
	getTrendingQueryOptions,
	trendingCategorySchema,
} from "#/features/media/utils/trending";
import { warmQuery } from "#/integrations/tanstack-query/warm-query";

const homeSearchSchema = z.object({
	// Left out of the URL on the default tab: `/` stays clean and `<Link to="/">`
	// elsewhere in the app does not have to carry a category.
	category: trendingCategorySchema.optional(),
});

export const Route = createFileRoute("/_appLayout/")({
	validateSearch: homeSearchSchema,
	loaderDeps: ({ search }) => ({
		category: search.category ?? DEFAULT_CATEGORY,
	}),
	loader: async ({ context, deps }) => {
		// Warmed on the server so the whole page arrives rendered. A failing list
		// is swallowed here on purpose: each section renders its own error state
		// rather than taking the page down with it.
		const { queryClient } = context;

		await Promise.all([
			warmQuery(queryClient, getTrendingQueryOptions(deps.category)),
			warmQuery(queryClient, getGenresQueryOptions()),
			...homeRailsFor(deps.category).map((rail) =>
				warmQuery(queryClient, rail.query),
			),
		]);
	},
	component: Home,
});

function Home() {
	const { category = DEFAULT_CATEGORY } = Route.useSearch();

	return (
		<main className="pb-8">
			{/* The visible headings belong to the hero slides and the rails. */}
			<h1 className="sr-only">Discover what to watch</h1>

			<CategoryTabs active={category} />

			{/* Keyed so switching tabs starts the new set at its first slide
			    instead of inheriting the previous scroll position. */}
			<HeroCarousel key={category} category={category} />

			{homeRailsFor(category).map((rail) => (
				<MediaRow key={rail.title} title={rail.title} query={rail.query} />
			))}
		</main>
	);
}
