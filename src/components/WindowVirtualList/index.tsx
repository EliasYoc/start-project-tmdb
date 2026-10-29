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
	 * @param listElement The `div` this component renders around the items, to
	 * use in the options (e.g. `scrollMargin`). `null` on the first render.
	 *
	 * @example
	 * getOptions={(listElement) => ({
	 * 	count: rows.length,
	 * 	estimateSize: () => 306,
	 * 	overscan: 1,
	 * 	gap: 8,
	 * 	scrollMargin: listElement?.offsetTop ?? 0,
	 * })}
	 */
	getOptions: (
		listElement: HTMLDivElement | null,
	) => WindowVirtualizerOptions<TItemElement>;
	/**
	 * Renders one item. It is only called for the items near the viewport (plus
	 * `overscan`), not for all `count` items.
	 *
	 * The returned element must place
	 * itself with these styles or the items pile up at the start:
	 * - Always: `position: absolute`, `top: 0`, `left: 0`.
	 * - Vertical (default): `width: 100%` and
	 *   `transform: translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`.
	 * - Horizontal (`horizontal: true`): `height: 100%` and
	 *   `transform: translateX(${virtualItem.start - virtualizer.options.scrollMargin}px)`.
	 *
	 * `start` counts from the start of the page (its top, or its left edge when
	 * horizontal), so the margin is subtracted to make it relative to the list.
	 *
	 * For its length along the scroll axis (height when vertical, width when
	 * horizontal), pick one:
	 * - `height` or `width` set to `${virtualItem.size}px`, when every item is
	 *   exactly as long as `estimateSize` says.
	 * - Leave it to the content and pass `ref={virtualizer.measureElement}` and
	 *   `data-index={virtualItem.index}`, when it varies (text wrapping,
	 *   breakpoints). The virtualizer measures each item and corrects the positions.
	 *
	 * @param virtualItem Where this item goes. `index` is its position in your
	 * data (use it to look the item up), `start` its offset from the start of the
	 * page and `size` its estimated or measured length along the scroll axis,
	 * both in px.
	 * @param virtualizer The virtualizer instance, for `options.scrollMargin`,
	 * `measureElement` and methods like `scrollToIndex`.
	 *
	 * @example
	 * // Vertical, every item as tall as `estimateSize`
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
	 *
	 * @example
	 * // Horizontal (`getOptions` returns `horizontal: true`), widths measured
	 * renderVirtualItem={(virtualItem, virtualizer) => (
	 * 	<div
	 * 		ref={virtualizer.measureElement}
	 * 		data-index={virtualItem.index}
	 * 		style={{
	 * 			position: "absolute",
	 * 			top: 0,
	 * 			left: 0,
	 * 			height: "100%",
	 * 			transform: `translateX(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
	 * 		}}
	 * 	>
	 * 		{movies[virtualItem.index].title}
	 * 	</div>
	 * )}
	 */
	renderVirtualItem: (
		virtualItem: VirtualItem,
		virtualizer: ReactVirtualizer<Window, TItemElement>,
	) => ReactNode;
};

/**
 * A virtualized list: it only renders the items you can see on screen (plus
 * `overscan`), not all of them, and it scrolls with the page.
 *
 * - It is vertical by default. For a horizontal one, return `horizontal: true`
 *   from `getOptions`.
 *
 * A horizontal list scrolls the whole page sideways, not a container inside it:
 * - No ancestor can have `overflow: hidden` or `overflow: auto`.
 * - Its parent needs a height, because the list takes the parent's height.
 *
 * Items that aren't rendered can't be found by screen readers or Ctrl+F, so use
 * it for long lists, not short ones.
 */
export default function WindowVirtualList<
	TItemElement extends Element = HTMLDivElement,
>({ renderVirtualItem, getOptions }: WindowVirtualListProps<TItemElement>) {
	const listRef = useRef<HTMLDivElement>(null);
	const virtualizer = useWindowVirtualizer(getOptions(listRef.current));
	const totalSize = `${virtualizer.getTotalSize()}px`;

	return (
		<div
			ref={listRef}
			className="list relative"
			// The items are absolutely positioned, so the list takes its length along
			// the scroll axis from the virtualizer and fills its parent across it.
			style={
				virtualizer.options.horizontal
					? { width: totalSize, height: "100%" }
					: { width: "100%", height: totalSize }
			}
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
