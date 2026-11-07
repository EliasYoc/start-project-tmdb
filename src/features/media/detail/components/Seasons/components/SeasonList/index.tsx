import type { Ref } from "react";
import type { Season } from "../../../../utils/series-seasons";
import { SeasonCard } from "./components/SeasonCard";

/**
 * A rail at every width: a long-running series has dozens of seasons, too many
 * for a grid. `scroll-px-5` matches the `*:px-5` that `DetailSection` gives this
 * list, so a snapped card lines up with the heading.
 */
export function SeasonList({
	ref,
	seasons,
	seriesTitle,
	scrollRestorationId,
}: {
	/** For the arrow buttons in the section heading. */
	ref?: Ref<HTMLUListElement>;
	seasons: Season[];
	/** For the posters' alt text. */
	seriesTitle: string;
	/** From `railScrollId`, so the next series' seasons start at the first one. */
	scrollRestorationId: string;
}) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: it is already a ul; the role is restated for Safari
		<ul
			ref={ref}
			// biome-ignore lint/a11y/noRedundantRoles: Safari drops the list role from a ul with list-style: none
			role="list"
			data-scroll-restoration-id={scrollRestorationId}
			className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 pb-2"
		>
			{seasons.map((season) => (
				<SeasonCard key={season.id} season={season} seriesTitle={seriesTitle} />
			))}
		</ul>
	);
}
