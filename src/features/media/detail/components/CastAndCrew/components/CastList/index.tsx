import type { CastMember } from "../../../../utils/media-credits";
import { CastCard } from "./components/CastCard";

/**
 * A swipeable rail on phones. From `md` up it becomes a grid instead: a mouse
 * has no thumb to swipe with, and the wider rows leave room for long character
 * names. `scroll-px-5` matches the `*:px-5` that `DetailSection` gives this
 * list, so a snapped card lines up with the heading.
 */
const LIST =
	"no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 pb-2 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-5 md:overflow-visible md:pb-0 lg:grid-cols-3";

export function CastList({ cast }: { cast: CastMember[] }) {
	return (
		<ul className={LIST}>
			{cast.map((person) => (
				<CastCard key={person.id} person={person} />
			))}
		</ul>
	);
}
