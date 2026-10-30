import { Button } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import type { MediaDetail } from "../../../../utils/media-detail";
import { GenreList } from "./components/GenreList";

export function HeroActions({
	genres,
	hasTrailer,
	onPlayTrailer,
}: {
	genres: MediaDetail["genres"];
	hasTrailer: boolean;
	onPlayTrailer: () => void;
}) {
	return (
		<div className="col-span-2 flex flex-col gap-6 md:col-span-1 md:col-start-2">
			<GenreList genres={genres} />

			<Button
				size="lg"
				radius="xl"
				disabled={!hasTrailer}
				leftSection={hasTrailer && <IconPlayerPlay size={20} />}
				onClick={onPlayTrailer}
				className="w-full md:w-fit md:px-10"
			>
				{hasTrailer ? "Watch Trailer" : "No trailer available"}
			</Button>
		</div>
	);
}
