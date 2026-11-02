import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { MediaCard } from "#/features/media/cards-layouts/components/MediaCard";
import { RailScrollButtons } from "#/features/media/cards-layouts/components/RailScrollButtons";
import { getGenresQueryOptions } from "#/features/media/cards-layouts/utils/genres";
import { type MediaDetail, railScrollId } from "../../utils/media-detail";
import { DetailSection } from "../DetailSection";

const TITLE = "More like this";

/**
 * The same cards as the home rails, so a title looks the same wherever it is
 * offered. Hidden when TMDB has nothing to suggest: an empty "more like this"
 * is a dead end, not information.
 */
export function RelatedTitles({ detail }: { detail: MediaDetail }) {
	const scrollerRef = useRef<HTMLUListElement>(null);
	// Only labels the cards' genre; they render without it until it arrives.
	const { data: genres } = useQuery(getGenresQueryOptions());

	if (detail.related.length === 0) return null;

	return (
		<DetailSection
			title={TITLE}
			action={<RailScrollButtons scrollerRef={scrollerRef} title={TITLE} />}
		>
			{/* `scroll-px-5` matches the `*:px-5` DetailSection gives this list. */}
			<ul
				ref={scrollerRef}
				data-scroll-restoration-id={railScrollId(detail, "related")}
				className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5"
			>
				{detail.related.map((item) => (
					<MediaCard
						key={`${item.mediaType}-${item.id}`}
						item={item}
						genres={genres}
					/>
				))}
			</ul>
		</DetailSection>
	);
}
