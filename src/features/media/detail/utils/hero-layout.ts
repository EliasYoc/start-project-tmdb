/**
 * The hero's box. It cancels `AppShell.Main`'s 16px padding on the sides and
 * top, so the art reaches the screen edges and starts under the header, then
 * pads its content back in, so a `Container size="lg" px={0}` inside lines up
 * with the sections below.
 */
export const FULL_BLEED = "-mx-4 -mt-4 px-4";

/**
 * Poster column on the left, everything else to its right. Until `lg` the
 * poster stays small and the genres and the trailer button drop under both
 * columns: phones are narrow, and from `md` the side navbar takes 300px.
 */
export const LAYOUT =
	"grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-start gap-x-4 gap-y-6 sm:grid-cols-[11rem_minmax(0,1fr)] lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-10";
