import { ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { RefObject } from "react";

/**
 * Arrow buttons for a horizontal rail, from `md` up: touch screens swipe, but a
 * mouse cannot scroll a rail whose scrollbar is hidden. Each press moves most
 * of a screen, leaving the last card visible for context.
 */
export function RailScrollButtons({
	scrollerRef,
	title,
}: {
	scrollerRef: RefObject<HTMLElement | null>;
	/** The rail's heading, so each button says which rail it scrolls. */
	title: string;
}) {
	const scrollBy = (direction: 1 | -1) => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		scroller.scrollBy({
			left: direction * scroller.clientWidth * 0.85,
			behavior: "smooth",
		});
	};

	return (
		<div className="hidden gap-2 md:flex">
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
	);
}
