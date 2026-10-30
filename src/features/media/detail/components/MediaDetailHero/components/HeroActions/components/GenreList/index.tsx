import { Badge } from "@mantine/core";
import type { MediaDetail } from "../../../../../../utils/media-detail";

export function GenreList({ genres }: { genres: MediaDetail["genres"] }) {
	if (genres.length === 0) return null;

	return (
		<ul aria-label="Genres" className="flex flex-wrap gap-2">
			{genres.map((genre) => (
				<li key={genre.id}>
					<Badge
						variant="default"
						size="lg"
						radius="md"
						tt="none"
						fw={500}
						className="bg-white/10 backdrop-blur-sm"
					>
						{genre.name}
					</Badge>
				</li>
			))}
		</ul>
	);
}
