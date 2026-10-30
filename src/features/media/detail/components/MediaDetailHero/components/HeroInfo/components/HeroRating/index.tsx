import { Text } from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { formatRating } from "#/features/media/cards-layouts/utils/media";

export function HeroRating({
	voteAverage,
	voteCount,
}: {
	voteAverage: number;
	voteCount: number;
}) {
	// An unrated title averages 0, which would read as the worst score possible.
	if (voteCount === 0) return null;

	return (
		<Text
			component="span"
			size="sm"
			fw={600}
			className="inline-flex items-center gap-1 text-white"
		>
			<IconStar
				size={14}
				className="text-yellow-400"
				fill="currentColor"
				aria-hidden
			/>
			<span className="sr-only">Rating: </span>
			{formatRating(voteAverage)}
			<span className="sr-only"> out of 10</span>
		</Text>
	);
}
