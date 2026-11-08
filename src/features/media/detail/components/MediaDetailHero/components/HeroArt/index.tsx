import { backdropUrl, posterUrl } from "#/integrations/tmdb/images";
import type { MediaDetail } from "../../../../utils/media-detail";

/**
 * Art direction: a tall poster fills a phone screen the way the 16:9 backdrop
 * cannot, so phones get the poster and wider screens get the backdrop. Each one
 * stands in for the other when TMDB only has one of them.
 *
 * Never taller than the hero (`max-h-full`): on tall screens 80vh outgrows the
 * content, and the art, painted over the page, would cover the next section.
 * Shrinking it keeps the fade ending in the page color.
 */
export function HeroArt({
	detail,
	children,
}: {
	detail: MediaDetail;
	children?: React.ReactNode;
}) {
	const backdrop = backdropUrl(detail.backdropPath, "w1280");
	const portrait = posterUrl(detail.posterPath, "w780") ?? backdrop;
	const landscape = backdrop ?? portrait;

	return (
		<div className="absolute inset-x-0 top-0 h-[78svh] max-h-full overflow-hidden md:h-[80vh]">
			{landscape && portrait ? (
				<picture>
					<source media="(min-width: 48em)" srcSet={landscape} />
					<img
						src={portrait}
						alt=""
						fetchPriority="high"
						className="size-full object-cover object-top"
					/>
				</picture>
			) : (
				<div className="size-full bg-linear-to-br from-(--mantine-color-brand-9) to-(--mantine-color-dark-7)" />
			)}

			<div
				aria-hidden
				className="absolute inset-0 bg-linear-to-b from-black/40 via-(--mantine-color-body)/50 via-50% to-(--mantine-color-body)"
			/>
			<div
				aria-hidden
				className="absolute inset-0 hidden bg-linear-to-r from-(--mantine-color-body)/80 via-transparent md:block"
			/>

			{children}
		</div>
	);
}
