import { createFileRoute } from "@tanstack/react-router";
import WindowVirtualizer from "#/components/WindowVirtualizer";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { getMediaListQueryOptions } from "#/features/media/cards-layouts/utils/media-list";
// import { getInTheatresMoviesQueryOptions } from "#/features/movies/movie-list/utils/in-theatres-movies";

export const Route = createFileRoute("/_appLayout/")({ component: Home });
const list = [
	{
		title: "Top Rated Series",
		query: getMediaListQueryOptions("tv/top_rated"),
	},
	{
		title: "Popular Series",
		query: getMediaListQueryOptions("tv/popular"),
	},
	{
		title: "On The Air Series",
		query: getMediaListQueryOptions("tv/on_the_air"),
	},
	{
		title: "In Theatres",
		query: getMediaListQueryOptions("movie/now_playing"),
	},
	{
		title: "Upcoming Movies",
		query: getMediaListQueryOptions("movie/upcoming"),
	},
	{
		title: "Popular Movies",
		query: getMediaListQueryOptions("movie/popular"),
	},
	{
		title: "Top Rated Movies",
		query: getMediaListQueryOptions("movie/top_rated"),
	},
];

function Home() {
	return (
		<>
			<WindowVirtualizer
				renderVirtualItem={(item, virtualizer) => (
					<MediaRow
						// key={item.key}
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
					/>
				)}
				getOptions={(element) => ({
					count: list.length,
					estimateSize: () => 306.15,
					overscan: 1,
					scrollMargin: element ? element.offsetTop : 0,
					gap: 8,
				})}
			/>

			{/* <MediaRow title="In Theatres" query={getInTheatresMoviesQueryOptions()} /> */}
		</>
	);
}
