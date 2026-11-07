import {
	createFileRoute,
	useElementScrollRestoration,
} from "@tanstack/react-router";
import MyWindowVirtualList from "#/components/MyWindowVirtualList";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { getMediaListQueryOptions } from "#/features/media/cards-layouts/utils/media-list";
// import { getInTheatresMoviesQueryOptions } from "#/features/movies/movie-list/utils/in-theatres-movies";

export const Route = createFileRoute("/_appLayout/")({ component: Home });
const list = [
	{
		title: "Top Rated Series",
		query: getMediaListQueryOptions("tv/top_rated"),
		scrollRestorationId: "home-top-rated-series",
	},
	{
		title: "Popular Series",
		query: getMediaListQueryOptions("tv/popular"),
		scrollRestorationId: "home-popular-series",
	},
	{
		title: "On The Air Series",
		query: getMediaListQueryOptions("tv/on_the_air"),
		scrollRestorationId: "home-on-the-air-series",
	},
	{
		title: "In Theatres",
		query: getMediaListQueryOptions("movie/now_playing"),
		scrollRestorationId: "home-in-theatres",
	},
	{
		title: "Upcoming Movies",
		query: getMediaListQueryOptions("movie/upcoming"),
		scrollRestorationId: "home-upcoming-movies",
	},
	{
		title: "Popular Movies",
		query: getMediaListQueryOptions("movie/popular"),
		scrollRestorationId: "home-popular-movies",
	},
	{
		title: "Top Rated Movies",
		query: getMediaListQueryOptions("movie/top_rated"),
		scrollRestorationId: "home-top-rated-movies",
	},
];

/**
 * On Back, the list starts at the window position TanStack Router saved, so the
 * rows that were on screen are mounted when the router restores each rail's own
 * scroll (found by its `scrollRestorationId`).
 */
function Home() {
	const savedScroll = useElementScrollRestoration({ getElement: () => window });

	return (
		<>
			<MyWindowVirtualList
				renderVirtualItem={(item, virtualizer) => (
					<MediaRow
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							height: `${item.size}px`,
							transform: `translateY(${
								item.start - virtualizer.options.scrollMargin
							}px)`,
						}}
						title={list[item.index].title}
						query={list[item.index].query}
						scrollRestorationId={list[item.index].scrollRestorationId}
					/>
				)}
				getOptions={(element) => ({
					count: list.length,
					estimateSize: () => 306.15,
					overscan: 1,
					scrollMargin: element ? element.offsetTop : 0,
					gap: 8,
					...(savedScroll && { initialOffset: savedScroll.scrollY }),
				})}
			/>

			{/* <MediaRow title="In Theatres" query={getInTheatresMoviesQueryOptions()} /> */}
		</>
	);
}
