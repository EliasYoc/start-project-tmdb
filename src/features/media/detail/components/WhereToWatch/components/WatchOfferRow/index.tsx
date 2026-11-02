import { Text, Tooltip } from "@mantine/core";
import { logoUrl } from "#/integrations/tmdb/images";
import type { WatchOffer } from "../../../../utils/watch-providers";

const LABELS: Record<WatchOffer["type"], string> = {
	flatrate: "Stream",
	free: "Free",
	ads: "Free with ads",
	rent: "Rent",
	buy: "Buy",
};

/**
 * Logos only: people scan for the services they know. The name is the logo's
 * alt text, and a hover or a tap shows it for the ones they don't.
 */
export function WatchOfferRow({ offer }: { offer: WatchOffer }) {
	return (
		<div className="grid gap-2 sm:grid-cols-[7rem_1fr] sm:items-center">
			<Text component="dt" size="sm" fw={500} c="dimmed">
				{LABELS[offer.type]}
			</Text>
			<dd>
				{/* biome-ignore lint/a11y/useSemanticElements: it is already a ul; the role is restated for Safari */}
				<ul
					// biome-ignore lint/a11y/noRedundantRoles: Safari drops the list role from a ul with list-style: none
					role="list"
					className="flex flex-wrap gap-2"
				>
					{offer.services.map((service) => (
						<li key={service.id}>
							<Tooltip
								label={service.name}
								events={{ hover: true, focus: false, touch: true }}
							>
								<img
									src={logoUrl(service.logoPath)}
									alt={service.name}
									width={48}
									height={48}
									loading="lazy"
									decoding="async"
									className="size-12 rounded-lg ring-1 ring-white/10"
								/>
							</Tooltip>
						</li>
					))}
				</ul>
			</dd>
		</div>
	);
}
