import { Skeleton } from "@mantine/core";
import { IconPlayerPlay, IconStar } from "@tabler/icons-react";
import { backdropUrl, posterUrl } from "#/integrations/tmdb/images";
import { type GenreIndex, genreNames } from "../../utils/genres";
import {
	formatRating,
	type MediaItem,
	releaseYear,
	tmdbWebUrl,
} from "../../utils/media";

/** Rail cards are a fixed width so every rail scrolls on the same rhythm. */
const CARD_WIDTH = "w-[248px] sm:w-[268px] lg:w-[292px]";

export function MediaCard({
	item,
	genres,
}: {
	item: MediaItem;
	genres?: GenreIndex;
}) {
	// Backdrops are 16:9 and match the card frame; posters are the fallback when
	// TMDB has no backdrop for a title, which is common outside the top results.
	const image =
		backdropUrl(item.backdropPath, "w780") ??
		posterUrl(item.posterPath, "w500");
	const year = releaseYear(item.date);
	const [genre] = genreNames(item, genres, 1);

	return (
		<article className={`${CARD_WIDTH} shrink-0 snap-start`}>
			<div className="relative aspect-video overflow-hidden rounded-xl bg-(--mantine-color-dark-6)">
				{image ? (
					<img
						src={image}
						alt={item.title}
						loading="lazy"
						decoding="async"
						className="size-full object-cover"
					/>
				) : (
					<div className="flex size-full items-center justify-center bg-linear-to-br from-(--mantine-color-dark-6) to-(--mantine-color-brand-9) px-4 text-center text-sm font-semibold text-neutral-300">
						{item.title}
					</div>
				)}

				<a
					href={tmdbWebUrl(item)}
					target="_blank"
					rel="noreferrer"
					aria-label={`Open ${item.title} on TMDB`}
					className="absolute right-3 bottom-3 grid size-11 place-items-center rounded-full bg-black/55 text-white ring-2 ring-(--mantine-color-brand-5) backdrop-blur-sm transition hover:scale-105 hover:bg-(--mantine-color-brand-6) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--mantine-color-brand-4)"
				>
					<IconPlayerPlay size={18} fill="currentColor" strokeWidth={0} />
				</a>
			</div>

			<h3 className="mt-3 truncate text-[15px] font-semibold text-white">
				{item.title}
			</h3>

			<div className="mt-1.5 flex items-center gap-2 text-[13px] text-neutral-400">
				<span className="inline-flex items-center gap-1 rounded bg-(--mantine-color-dark-6) px-1.5 py-0.5 font-semibold text-white">
					<IconStar size={12} className="text-yellow-400" fill="currentColor" />
					{formatRating(item.voteAverage)}
				</span>
				{year && <span>{year}</span>}
				{genre && (
					<>
						<span aria-hidden className="text-neutral-600">
							|
						</span>
						<span className="truncate">{genre}</span>
					</>
				)}
			</div>
		</article>
	);
}

export function MediaCardSkeleton() {
	return (
		<div className={`${CARD_WIDTH} shrink-0`}>
			<Skeleton radius="lg" className="aspect-video" />
			<Skeleton height={14} mt="sm" width="75%" radius="sm" />
			<Skeleton height={12} mt={10} width="50%" radius="sm" />
		</div>
	);
}
