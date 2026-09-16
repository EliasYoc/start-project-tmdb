import type {
	QueryClient,
	QueryFunction,
	QueryKey,
} from "@tanstack/react-query";

/**
 * Fills the cache from a route loader so the markup ships rendered.
 *
 * `staleTime: "static"` is the replacement for the deprecated
 * `ensureQueryData` — it reuses whatever is already cached instead of
 * refetching. Rejections are swallowed so one failing list cannot take the
 * whole route down; the section that owns the query renders its own error
 * state from the cached rejection instead.
 *
 * Only `queryKey`/`queryFn` are forwarded: `queryClient.query()` takes fetch
 * options, not the observer options a `queryOptions()` object carries.
 */
export function warmQuery<TData, TKey extends QueryKey>(
	queryClient: QueryClient,
	options: {
		queryKey: TKey;
		queryFn?: QueryFunction<TData, TKey, never>;
	},
): Promise<TData | undefined> {
	return queryClient
		.query({
			queryKey: options.queryKey,
			queryFn: options.queryFn,
			staleTime: "static",
		})
		.catch(() => undefined);
}
