import { useQuery } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import type { MediaListQueryOptions } from "../../../../utils/media-list";
import { MediaRowView } from "../MediaRowView";

/**
 * Runs the row's query and passes its state on: no data yet shows skeletons,
 * an error shows a notice.
 */
export function QueryMediaRow({
	query,
	...props
}: Omit<ComponentProps<typeof MediaRowView>, "items" | "isError"> & {
	query: MediaListQueryOptions;
}) {
	const { data, isError } = useQuery(query);

	return <MediaRowView {...props} items={data} isError={isError} />;
}
