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
	/** Receives the list container; it is `null` until the first render commits. */
	getOptions: (
		listElement: HTMLDivElement | null,
	) => WindowVirtualizerOptions<TItemElement>;
	renderVirtualItem: (
		virtualItem: VirtualItem,
		virtualizer: ReactVirtualizer<Window, TItemElement>,
	) => ReactNode;
};

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
