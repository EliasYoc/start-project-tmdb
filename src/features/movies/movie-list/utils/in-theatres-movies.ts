import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { tmdb } from "#/integrations/tmdb/tmdb.server";

const fetchInTheatresMovies = createServerFn().handler(async () => {
	const res = tmdb.movie_lists.now_playing();
	return res;
});

export const getInTheatresMoviesQueryOptions = () =>
	queryOptions({
		queryKey: ["in-theatres-movies"],
		queryFn: fetchInTheatresMovies,
	});
