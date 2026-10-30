/**
 * Bleeds past `AppShell.Main`'s `md` padding so the art reaches the edges, the
 * way the rails do with their own gutters.
 */
export const FULL_BLEED = "-mx-4 -mt-4";

/**
 * Poster column on the left, everything else to its right. On phones the
 * genres and the trailer button drop under both columns to get the full width.
 */
export const LAYOUT =
	"grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-start gap-x-4 gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[15rem_minmax(0,1fr)] md:gap-x-10";
