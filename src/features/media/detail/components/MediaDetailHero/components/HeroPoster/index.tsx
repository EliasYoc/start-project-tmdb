import { posterUrl } from "#/integrations/tmdb/images";

export function HeroPoster({
	posterPath,
	title,
}: {
	posterPath?: string;
	title: string;
}) {
	const poster = posterUrl(posterPath, "w500");

	return (
		<div className="aspect-2/3 overflow-hidden rounded-xl bg-(--mantine-color-dark-6) shadow-2xl ring-1 ring-white/10 md:row-span-2">
			{poster ? (
				<img
					src={poster}
					alt={`Poster for ${title}`}
					decoding="async"
					className="size-full object-cover"
				/>
			) : (
				// Visual stand-in only; the h1 carries the title for assistive tech.
				<div
					aria-hidden
					className="flex size-full items-center justify-center bg-linear-to-br from-(--mantine-color-dark-6) to-(--mantine-color-brand-9) p-3 text-center text-sm font-semibold text-neutral-300"
				>
					{title}
				</div>
			)}
		</div>
	);
}
