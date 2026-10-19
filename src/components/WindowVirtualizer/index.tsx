import {
	type ReactVirtualizer,
	useWindowVirtualizer,
	type VirtualItem,
} from "@tanstack/react-virtual";
import { type ReactNode, useRef } from "react";

/** Same options `useWindowVirtualizer` accepts, so they stay in sync with the library. */
type WindowVirtualizerOptions<TItemElement extends Element> = Parameters<
	typeof useWindowVirtualizer<TItemElement>
>[0];

type WindowVirtualizerProps<TItemElement extends Element> = {
	/** Receives the list container; it is `null` until the first render commits. */
	getOptions: (
		listElement: HTMLDivElement | null,
	) => WindowVirtualizerOptions<TItemElement>;
	renderVirtualItem: (
		virtualItem: VirtualItem,
		virtualizer: ReactVirtualizer<Window, TItemElement>,
	) => ReactNode;
};

export default function WindowVirtualizer<
	TItemElement extends Element = HTMLDivElement,
>({ renderVirtualItem, getOptions }: WindowVirtualizerProps<TItemElement>) {
	const refList = useRef<HTMLDivElement>(null);
	const virtualizer = useWindowVirtualizer(getOptions(refList.current));

	return (
		<div
			ref={refList}
			className="list relative w-full"
			style={{
				height: `${virtualizer.getTotalSize()}px`,
			}}
		>
			{/* {renderItems(virtualizer)} */}
			{virtualizer
				.getVirtualItems()
				.map((virtualItem) => renderVirtualItem(virtualItem, virtualizer))}
		</div>
	);
}
