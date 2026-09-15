import { useQuery } from "@tanstack/react-query";
import { getInTheatresMoviesQueryOptions } from "../../utils/in-theatres-movies";

export function InTheatresMovies() {
	const { data, status } = useQuery(getInTheatresMoviesQueryOptions());
	console.log("data", data);
	console.log("status", status);
	return <div>InTheatresMovies</div>;
}
