import { getMediaListQueryOptions } from "#/features/media/utils/media-lists";

/** Movies currently in theatres (TMDB `movie/now_playing`). */
export const getInTheatresMoviesQueryOptions = () =>
	getMediaListQueryOptions("movie/now_playing");
