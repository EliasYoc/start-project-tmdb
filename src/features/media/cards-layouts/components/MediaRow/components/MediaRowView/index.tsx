import { useQuery } from "@tanstack/react-query";
import { type ComponentProps, useRef } from "react";
import { getGenresQueryOptions } from "../../../../utils/genres";
import type { MediaItem } from "../../../../utils/media";
import { MediaCard, MediaCardSkeleton } from "../../../MediaCard";
import { RailScrollButtons } from "../../../RailScrollButtons";

const SKELETON_COUNT = 6;

/**
 * The row itself: heading, arrows and cards. It doesn't care where the cards
 * come from; `MediaRow` hands it either a query's state or ready items.
 */
export function MediaRowView({
	title,
	items,
	isError = false,
	scrollRestorationId,
	className,
	...sectionProps
}: Omit<ComponentProps<"section">, "title" | "children"> & {
	title: string;
	/** `undefined` while the first load is in flight: skeletons stand in. */
	items: MediaItem[] | undefined;
	isError?: boolean;
	/**
	 * Names the rail for TanStack Router's scroll restoration. Without it the
	 * router finds the rail by its position in the DOM, so on a route that
	 * shows other content at the same spot (one title's "More like this", then
	 * the next one's) the new rail opens where the old one was left.
	 */
	scrollRestorationId?: string;
}) {
	const { data: genres } = useQuery(getGenresQueryOptions());
	const scrollerRef = useRef<HTMLUListElement>(null);

	const isPending = items === undefined;
	const isScrollable = !isError && (isPending || items.length > 0);

	return (
		<section
			{...sectionProps}
			className={className ? `py-4 ${className}` : "py-4"}
		>
			<header className="mb-4 flex items-center justify-between gap-4 px-4">
				<h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>

				{isScrollable && (
					<RailScrollButtons scrollerRef={scrollerRef} title={title} />
				)}
			</header>

			{isError ? (
				<p className="px-4 text-sm text-neutral-400 sm:px-6 lg:px-8">
					We could not load {title.toLowerCase()} right now.
				</p>
			) : !isPending && items.length === 0 ? (
				<p className="px-4 text-sm text-neutral-400 sm:px-6 lg:px-8">
					Nothing here at the moment.
				</p>
			) : (
				// biome-ignore lint/a11y/useSemanticElements: it is already a ul; the role is restated for Safari
				<ul
					ref={scrollerRef}
					// biome-ignore lint/a11y/noRedundantRoles: Safari drops the list role from a ul with list-style: none
					role="list"
					data-scroll-restoration-id={scrollRestorationId}
					aria-busy={isPending}
					className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 sm:scroll-px-6 lg:scroll-px-8"
				>
					{isPending
						? Array.from({ length: SKELETON_COUNT }, (_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length placeholder list
								<MediaCardSkeleton key={index} />
							))
						: items.map((item) => (
								<MediaCard
									key={`${item.mediaType}-${item.id}`}
									item={item}
									genres={genres}
								/>
							))}
				</ul>
			)}
		</section>
	);
}
