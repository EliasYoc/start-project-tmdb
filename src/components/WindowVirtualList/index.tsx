import {
	type ReactVirtualizer,
	useWindowVirtualizer,
	type VirtualItem,
} from "@tanstack/react-virtual";
import { Fragment, type ReactNode, useRef } from "react";

/** Same options `useWindowVirtualizer` accepts, so they stay in sync with the library. */
type WindowVirtualizerOptions<TItemElement extends Element> = Parameters<
	typeof useWindowVirtualizer<TItemElement>
>[0];

type WindowVirtualListProps<TItemElement extends Element> = {
	/**
	 * Options for `useWindowVirtualizer`, read on every render.
	 * See https://tanstack.com/virtual/latest/docs/api/virtualizer
	 *
	 * `listElement` is the list container, for options that depend on where the
	 * list sits in the page, such as `scrollMargin`. It is `null` on the first
	 * render, before the container exists.
	 */
	getOptions: (
		listElement: HTMLDivElement | null,
	) => WindowVirtualizerOptions<TItemElement>;
	/**
	 * Renders one item. It is only called for the items near the viewport (plus
	 * `overscan`), not for all `count` items, and it doesn't need a `key`.
	 *
	 * The list doesn't position anything: it is a `position: relative` container
	 * as tall as all the items together, so the returned element must place
	 * itself with these styles or the items pile up at the top:
	 * - `position: absolute`, `top: 0`, `left: 0`, `width: 100%`
	 * - `transform: translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`.
	 *   `start` counts from the top of the page, so the margin is subtracted to
	 *   make it relative to the list.
	 *
	 * For its height, pick one:
	 * - `height: ${virtualItem.size}px`, when every item is exactly as tall as
	 *   `estimateSize` says.
	 * - Leave the height to the content and pass `ref={virtualizer.measureElement}`
	 *   and `data-index={virtualItem.index}`, when it varies (text wrapping,
	 *   breakpoints). The virtualizer measures each item and corrects the positions.
	 *
	 * @param virtualItem Where this item goes. `index` is its position in your
	 * data (use it to look the item up), `start` its offset from the top of the
	 * page and `size` its estimated or measured height, both in px.
	 * @param virtualizer The virtualizer instance, for `options.scrollMargin`,
	 * `measureElement` and methods like `scrollToIndex`.
	 *
	 * @example
	 * renderVirtualItem={(virtualItem, virtualizer) => (
	 * 	<MediaRow
	 * 		style={{
	 * 			position: "absolute",
	 * 			top: 0,
	 * 			left: 0,
	 * 			width: "100%",
	 * 			height: `${virtualItem.size}px`,
	 * 			transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
	 * 		}}
	 * 		{...rows[virtualItem.index]}
	 * 	/>
	 * )}
	 */
	renderVirtualItem: (
		virtualItem: VirtualItem,
		virtualizer: ReactVirtualizer<Window, TItemElement>,
	) => ReactNode;
};

/**
 * A vertical list that scrolls with the page and only mounts the items near the
 * viewport, built on `useWindowVirtualizer`. Laying out each item is left to
 * `renderVirtualItem`, so every list decides how its items are positioned and sized.
 *
 * Items that aren't mounted can't be found by screen readers or Ctrl+F, so it
 * pays off on long lists rather than short ones.
 *
 * `TItemElement` is the element your items render (`HTMLDivElement` by
 * default); it types `virtualizer.measureElement`.
 */
export default function WindowVirtualList<
	TItemElement extends Element = HTMLDivElement,
>({ renderVirtualItem, getOptions }: WindowVirtualListProps<TItemElement>) {
	const listRef = useRef<HTMLDivElement>(null);
	const virtualizer = useWindowVirtualizer(getOptions(listRef.current));

	return (
		<div
			ref={listRef}
			className="list relative w-full"
			style={{
				height: `${virtualizer.getTotalSize()}px`,
			}}
		>
			{/* {renderItems(virtualizer)} */}
			{virtualizer.getVirtualItems().map((virtualItem) => (
				<Fragment key={virtualItem.key}>
					{renderVirtualItem(virtualItem, virtualizer)}
				</Fragment>
			))}
		</div>
	);
}
