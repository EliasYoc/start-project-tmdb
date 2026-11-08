import { Badge, Tooltip } from "@mantine/core";
import type { AgeRating } from "../../../../../../utils/age-rating";
import { regionName } from "../../../../../../utils/watch-providers";

/**
 * Outlined, so it reads as a rating stamp and not as a tag like "Movie". A
 * `span`, because it sits inside the hero's meta paragraph. When the rating is
 * not from the viewer's country (theirs had none), the country code follows it,
 * so a US "R" is not taken for a local one; the tooltip and screen readers get
 * the full country name.
 */
export function AgeRatingBadge({
	ageRating,
	viewerRegion,
}: {
	ageRating: AgeRating;
	/** `WatchAvailability.region`, the country the page was built for. */
	viewerRegion: string;
}) {
	const country = regionName(ageRating.region);

	return (
		<>
			<span className="sr-only">Age rating in {country}: </span>
			<Tooltip
				label={`Rated ${ageRating.rating} in ${country}`}
				events={{ hover: true, focus: false, touch: true }}
			>
				<Badge
					component="span"
					variant="outline"
					color="gray"
					size="sm"
					radius="sm"
					mr="xs"
				>
					{ageRating.rating}
					{ageRating.region !== viewerRegion && (
						<span aria-hidden> · {ageRating.region}</span>
					)}
				</Badge>
			</Tooltip>
		</>
	);
}
