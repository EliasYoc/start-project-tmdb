import { ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { getGenresQueryOptions } from "../../utils/genres";
import type { MediaListQueryOptions } from "../../utils/media-list";
import { MediaCard, MediaCardSkeleton } from "../MediaCard";

const SKELETON_COUNT = 6;

/**
 * A horizontally scrollable rail of media cards. Swipe on touch, arrow buttons
 * on pointer devices where there is no thumb to drag.
 */
export function MediaRow({
	title,
	query,
}: {
	title: string;
	query: MediaListQueryOptions;
}) {
	const { data: items, isPending, isError } = useQuery(query);
	const { data: genres } = useQuery(getGenresQueryOptions());
	const scrollerRef = useRef<HTMLUListElement>(null);

	const scrollBy = (direction: 1 | -1) => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		scroller.scrollBy({
			left: direction * scroller.clientWidth * 0.85,
			behavior: "smooth",
		});
	};

	// Nothing to scroll past an error or an empty list, so the arrows go away.
	const isScrollable = !isError && (isPending || items.length > 0);

	return (
		<section className="py-4">
			<header className="mb-4 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>

				<div className={`gap-2 ${isScrollable ? "hidden md:flex" : "hidden"}`}>
					<ActionIcon
						variant="subtle"
						color="gray"
						size="lg"
						radius="xl"
						aria-label={`Scroll ${title} left`}
						onClick={() => scrollBy(-1)}
					>
						<IconChevronLeft />
					</ActionIcon>
					<ActionIcon
						variant="subtle"
						color="gray"
						size="lg"
						radius="xl"
						aria-label={`Scroll ${title} right`}
						onClick={() => scrollBy(1)}
					>
						<IconChevronRight />
					</ActionIcon>
				</div>
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
				// Tailwind's preflight sets list-style: none, which makes Safari/VoiceOver
				// drop the implicit list role, so it is restated explicitly.
				<ul
					ref={scrollerRef}
					aria-busy={isPending}
					className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-8 lg:px-8"
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
