import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_appLayout/movies/")({
	component: Movies,
});
function Movies() {
	return (
		<main>
			<h1>Movies</h1>
		</main>
	);
}
