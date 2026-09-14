import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/tv-shows/")({
	component: TvShows,
});

function TvShows() {
	return (
		<main>
			<h1>Tv Shows</h1>
		</main>
	);
}
