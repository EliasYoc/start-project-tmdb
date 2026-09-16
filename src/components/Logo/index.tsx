import { Link } from "@tanstack/react-router";

export const APP_NAME = { head: "Cine", tail: "Radar" } as const;
export const APP_TAGLINE = "find what to watch tonight";

/**
 * Two-tone wordmark plus tagline. `withTagline` is off on the mobile header,
 * where the vertical room goes to the hero instead.
 */
export function Logo({ withTagline = true }: { withTagline?: boolean }) {
	return (
		<Link
			to="/"
			className="group flex flex-col gap-0.5 leading-none no-underline"
			aria-label={`${APP_NAME.head}${APP_NAME.tail} — home`}
		>
			<span className="text-2xl font-extrabold tracking-tight text-white">
				{APP_NAME.head}
				<span className="text-brand-400 transition-colors group-hover:text-brand-300">
					{APP_NAME.tail}
				</span>
			</span>
			{withTagline && (
				<span className="text-[11px] font-medium text-neutral-400">
					{APP_TAGLINE}
				</span>
			)}
		</Link>
	);
}
