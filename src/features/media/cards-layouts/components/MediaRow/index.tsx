import type { ComponentProps } from "react";
import type { MediaItem } from "../../utils/media";
import type { MediaListQueryOptions } from "../../utils/media-list";
import { MediaRowView } from "./components/MediaRowView";
import { QueryMediaRow } from "./components/QueryMediaRow";

/**
 * Where the cards come from, exactly one of the two:
 * - `query`: the row fetches them, with skeletons while it waits and a notice
 *   if it fails.
 * - `items`: data the parent already has, such as a route loader's, shown as is.
 */
type MediaRowSource =
	| { query: MediaListQueryOptions; items?: never }
	| { items: MediaItem[]; query?: never };

/**
 * `title` is the heading text rather than the HTML tooltip attribute, and the
 * row renders its own content (see `MediaRowView`).
 */
type MediaRowProps = Omit<
	ComponentProps<typeof MediaRowView>,
	"items" | "isError"
> &
	MediaRowSource;

/**
 * A horizontally scrollable rail of media cards. Swipe on touch, arrow buttons
 * on pointer devices where there is no thumb to drag.
 */
export function MediaRow({ query, items, ...props }: MediaRowProps) {
	return query ? (
		<QueryMediaRow {...props} query={query} />
	) : (
		<MediaRowView {...props} items={items} />
	);
}
