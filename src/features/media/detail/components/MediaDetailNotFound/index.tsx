import { Button, Container, Text, Title } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import type { MediaDetail } from "../../utils/media-detail";

/** For ids TMDB does not know, or a param that is not an id at all. */
export function MediaDetailNotFound({
	mediaType,
}: {
	mediaType: MediaDetail["mediaType"];
}) {
	const isMovie = mediaType === "movie";
	return (
		<Container size="sm" py="xl" className="text-center">
			<Title order={1} className="text-2xl text-white">
				{isMovie
					? "We could not find this movie"
					: "We could not find this series"}
			</Title>
			<Text c="dimmed" mt="sm">
				The link may be outdated, or TMDB no longer lists this title.
			</Text>
			<Button
				component={Link}
				to={isMovie ? "/movies" : "/tv-shows"}
				mt="lg"
				radius="xl"
			>
				{isMovie ? "Browse movies" : "Browse series"}
			</Button>
		</Container>
	);
}
