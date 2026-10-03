import { createFileRoute } from "@tanstack/react-router";
import { MediaRow } from "#/features/media/cards-layouts/components/MediaRow";
import { getMediaListQueryOptions } from "#/features/media/cards-layouts/utils/media-list";
// import { getInTheatresMoviesQueryOptions } from "#/features/movies/movie-list/utils/in-theatres-movies";

export const Route = createFileRoute("/_appLayout/")({ component: Home });

function Home() {
	return (
		<div>
			<MediaRow
				title="Top Rated Series"
				query={getMediaListQueryOptions("tv/top_rated")}
			/>
			<MediaRow
				title="Popular Series"
				query={getMediaListQueryOptions("tv/popular")}
			/>
			<MediaRow
				title="On The Air Series"
				query={getMediaListQueryOptions("tv/on_the_air")}
			/>
			<MediaRow
				title="In Theatres"
				query={getMediaListQueryOptions("movie/now_playing")}
			/>
			<MediaRow
				title="Upcoming Movies"
				query={getMediaListQueryOptions("movie/upcoming")}
			/>
			<MediaRow
				title="Popular Movies"
				query={getMediaListQueryOptions("movie/popular")}
			/>
			<MediaRow
				title="Top Rated Movies"
				query={getMediaListQueryOptions("movie/top_rated")}
			/>

			{/* <MediaRow title="In Theatres" query={getInTheatresMoviesQueryOptions()} /> */}
		</div>
	);
}
