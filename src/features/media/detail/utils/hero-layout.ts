/**
 * Cancels `AppShell.Main`'s `md` padding so a block reaches the screen edges,
 * the way the rails do with their own gutters.
 */
export const BLEED_X = "-mx-4";

/** The hero also bleeds past the top padding, so the art starts under the header. */
export const FULL_BLEED = `${BLEED_X} -mt-4`;

/**
 * Side padding of every block on the detail page, matching the rails' gutters.
 * Passed as Mantine's `px` prop rather than Tailwind classes: `Container`'s own
 * unlayered `padding-inline` beats Tailwind's `@layer utilities`.
 */
export const PAGE_GUTTER = { base: 16, sm: 24, lg: 32 };

/**
 * Poster column on the left, everything else to its right. On phones the
 * genres and the trailer button drop under both columns to get the full width.
 */
export const LAYOUT =
	"grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-start gap-x-4 gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[15rem_minmax(0,1fr)] md:gap-x-10";
