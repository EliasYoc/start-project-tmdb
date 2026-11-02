import { Anchor, Text, VisuallyHidden } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import {
	regionName,
	type WatchAvailability,
} from "../../utils/watch-providers";
import { DetailSection } from "../DetailSection";
import { WatchOfferRow } from "./components/WatchOfferRow";

/**
 * Always shown, like the cast: "not available here" answers the question the
 * viewer came with. The country is named because availability depends on it,
 * and JustWatch is credited because TMDB's terms require it for this data.
 */
export function WhereToWatch({ watch }: { watch: WatchAvailability }) {
	return (
		<DetailSection title="Where to watch">
			{/* One wrapper: DetailSection pads its direct children, and Mantine's
			    `Text` resets padding with CSS that beats Tailwind's. */}
			<div>
				{watch.offers.length > 0 ? (
					<dl className="grid gap-4">
						{watch.offers.map((offer) => (
							<WatchOfferRow key={offer.type} offer={offer} />
						))}
					</dl>
				) : (
					<Text size="sm" c="dimmed">
						Not available to stream, rent or buy right now.
					</Text>
				)}

				<div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
					<Text size="xs" c="dimmed">
						Availability in {regionName(watch.region)}, from JustWatch.
					</Text>
					{watch.link && (
						<Anchor
							href={watch.link}
							target="_blank"
							rel="noopener noreferrer"
							size="sm"
							// A prop, not a class: Anchor's own CSS sets display: inline.
							display="inline-flex"
							className="items-center gap-1"
						>
							All options on TMDB
							<IconExternalLink size={14} aria-hidden />
							<VisuallyHidden>(opens in a new tab)</VisuallyHidden>
						</Anchor>
					)}
				</div>
			</div>
		</DetailSection>
	);
}
